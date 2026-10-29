import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { GambaUi, useCurrentPool } from 'gamba-react-ui-v2'
import { useTransactionError } from 'gamba-react-v2'

import { Modal } from './components/Modal'
import Sidebar from './components/Sidebar'
import LiveFeedRail from './components/LiveFeedRail'
import { TOS_HTML } from './constants'
import { useToast } from './hooks/useToast'
import { useUserStore } from './hooks/useUserStore'

import Dashboard from './sections/Dashboard/Dashboard'
import Game from './sections/Game/Game'
import Header from './sections/Header'
import Toasts from './sections/Toasts'

import styled from 'styled-components'

const Shell = styled.div`
  display: flex;
  min-height: calc(100vh - 64px);
`

const Main = styled.main`
  flex: 1;
  min-width: 0;
  padding: var(--s4);
  display: flex;
  flex-direction: column;
  gap: var(--s4);
  @media (max-width: 600px) {
    padding: var(--s3);
  }
`

const TosWrapper = styled.div`
  position: relative;
  &:after {
    content: "";
    background: linear-gradient(180deg, transparent, #101218);
    height: 50px;
    pointer-events: none;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
  }
`

const TosInner = styled.div`
  max-height: 400px;
  padding: 10px;
  overflow: auto;
`

function useTelegramMiniApp() {
  React.useEffect(() => {
    try {
      const tg = (window as any).Telegram?.WebApp
      if (tg) {
        tg.ready()
        tg.expand()
        tg.disableVerticalSwipes?.()
        tg.enableClosingConfirmation?.()
        const cs = tg.CloudStorage
        if (cs?.getItems) {
          cs.getItems(['select_ref', 'select_last_wallet', 'select_session_stats'], (_err: any, vals: Record<string, string>) => {
            if (!vals) return
            try {
              if (vals.select_ref && !sessionStorage.getItem('select_ref')) sessionStorage.setItem('select_ref', vals.select_ref)
              if (vals.select_last_wallet && !localStorage.getItem('select_last_wallet')) localStorage.setItem('select_last_wallet', vals.select_last_wallet)
              if (vals.select_session_stats && !localStorage.getItem('select_session_stats')) localStorage.setItem('select_session_stats', vals.select_session_stats)
            } catch {}
          })
        }
        const startParam = tg.initDataUnsafe?.start_param
        if (startParam && startParam.startsWith('ref_')) {
          const ref = startParam.slice(4)
          if (ref.length >= 32 && !window.location.search.includes('ref=')) {
            const url = new URL(window.location.href)
            url.searchParams.set('ref', ref)
            window.history.replaceState(null, '', url.toString())
          }
        }
      }
    } catch {}
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    if (ref && ref.length >= 32) {
      try { sessionStorage.setItem('select_ref', ref) } catch {}
      try { localStorage.setItem('select_ref', ref) } catch {}
      try { const cs = (window as any).Telegram?.WebApp?.CloudStorage; if (cs?.setItem) cs.setItem('select_ref', ref) } catch {}
    }
    ;(window as any).selectHaptic = (type: string) => {
      try {
        const hf = (window as any).Telegram?.WebApp?.HapticFeedback
        if (hf) { if (type === 'bet') hf.impactOccurred('medium'); else if (type === 'win') hf.notificationOccurred('success'); else hf.notificationOccurred('error'); return }
        if (navigator.vibrate) navigator.vibrate(type === 'bet' ? 40 : type === 'win' ? [40, 30, 40] : 20)
      } catch {}
    }
  }, [])
}

function ScrollToTop() {
  const { pathname } = useLocation()
  React.useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

function ErrorHandler() {
  const walletModal = useWalletModal()
  const toast = useToast()
  useTransactionError((err) => {
    if (err.message === 'NOT_CONNECTED') { walletModal.setVisible(true) }
    else { toast({ title: 'Transaction error', description: err.error?.errorMessage ?? err.message }) }
  })
  return null
}

function usePoolBalanceLamports(): number {
  const pool = useCurrentPool()
  const [apiBalance, setApiBalance] = React.useState(0)

  React.useEffect(() => {
    fetch('https://api.tryaigility.com/v1/rea/pool-config')
      .then(r => r.json())
      .then(d => { if (d.poolBalanceLamports) setApiBalance(d.poolBalanceLamports) })
      .catch(() => {})
  }, [])

  const onChain = pool?.poolBalance ?? 0
  return onChain > 0 ? onChain : apiBalance
}

export default function App() {
  const newcomer = useUserStore((s) => s.newcomer)
  const set = useUserStore((s) => s.set)
  const poolBalance = usePoolBalanceLamports()
  const poolSol = poolBalance / 1e9

  useTelegramMiniApp()

  return (
    <>
      {newcomer && (
        <Modal>
          <h1>Welcome</h1>
          <TosWrapper><TosInner dangerouslySetInnerHTML={{ __html: TOS_HTML }} /></TosWrapper>
          <p>By playing on our platform, you confirm your compliance.</p>
          <GambaUi.Button main onClick={() => set({ newcomer: false })}>Acknowledge</GambaUi.Button>
        </Modal>
      )}

      <ScrollToTop />
      <ErrorHandler />
      <Header />
      <Toasts />

      <Shell>
        <Sidebar poolBalance={poolSol} />

        <Main>
          <Routes>
            <Route path="/" element={<Dashboard poolBalance={poolSol} />} />
            <Route path="/:gameId" element={<Game poolBalance={poolSol} />} />
          </Routes>
        </Main>

        <LiveFeedRail poolBalance={poolSol} />
      </Shell>
    </>
  )
}
