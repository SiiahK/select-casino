import React from 'react'
import { BPS_PER_WHOLE, GambaTransaction } from 'gamba-core-v2'
import { GambaUi, TokenValue, useTokenMeta } from 'gamba-react-ui-v2'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { extractMetadata } from '../../utils'
import { PLATFORM_CREATOR_ADDRESS } from '../../constants'
import { Container, Jackpot, Profit, Recent, Skeleton } from './RecentPlays.styles'
import { ShareModal } from './ShareModal'
import { useRecentPlays } from './useRecentPlays'

const API_BASE = 'https://api.tryaigility.com'
const SOLSCAN_PROGRAM = 'https://solscan.io/account/Gamba2hK6KV3quKq854B3sQG1WMdq3zgQLPKqyK4qS18'

interface ApiFeedEntry {
  signature: string
  wallet: string
  walletFull: string
  game: string
  token: string
  wager: number
  payout: number
  won: boolean
  multiplier: number
  blockTime: number
  timeAgo: number
}

function TimeDiff({ time, suffix = 'ago' }: { time: number; suffix?: string }) {
  const diff = Date.now() - time
  return React.useMemo(() => {
    const sec = Math.floor(diff / 1000)
    const min = Math.floor(sec / 60)
    const hrs = Math.floor(min / 60)
    if (hrs >= 1) return <>{hrs}h {suffix}</>
    if (min >= 1) return <>{min}m {suffix}</>
    return <>Just now</>
  }, [diff, suffix])
}

function RecentPlay({ event }: { event: GambaTransaction<'GameSettled'> }) {
  const data = event.data
  const token = useTokenMeta(data.tokenMint)
  const md = useMediaQuery('md')

  const multiplier = data.bet[data.resultIndex.toNumber()] / BPS_PER_WHOLE
  const wager = data.wager.toNumber()
  const payout = multiplier * wager
  const profit = payout - wager

  const { game } = extractMetadata(event)

  return (
    <>
      <img src={game?.meta.image} style={{ height: '1.5em' }} />
      <div style={{ color: 'var(--gamba-ui-primary-color)' }}>
        {data.user.toBase58().slice(0, 4)}…
      </div>
      {md && (profit >= 0 ? ' won ' : ' lost ')}
      <Profit $win={profit > 0}>
        <img src={token.image} height="20px" style={{ borderRadius: '50%' }} />
        <TokenValue amount={Math.abs(profit)} mint={data.tokenMint} />
      </Profit>
      {md && profit > 0 && <div>({multiplier.toFixed(2)}x)</div>}
      {md && data.jackpotPayoutToUser.toNumber() > 0 && (
        <Jackpot>
          +<TokenValue mint={data.tokenMint} amount={data.jackpotPayoutToUser.toNumber()} />
        </Jackpot>
      )}
    </>
  )
}

function ApiFeedRow({ entry }: { entry: ApiFeedEntry }) {
  const md = useMediaQuery('md')
  const profit = entry.payout - entry.wager
  const gameEmoji: Record<string, string> = {
    flip: '🪙', dice: '🎲', slots: '🎰', blackjack: '🃏', roulette: '🎯',
    crash: '📈', plinko: '📍', plinko_degen: '📍', hilo: '🔼', mines: '💣',
  }

  return (
    <Recent
      as="a"
      href={`https://solscan.io/tx/${entry.signature}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '.5em' }}>
        <span style={{ fontSize: '1.2em' }}>{gameEmoji[entry.game] || '🎮'}</span>
        <div style={{ color: 'var(--gamba-ui-primary-color)' }}>
          {entry.wallet}
        </div>
        {md && (profit >= 0 ? ' won ' : ' lost ')}
        <Profit $win={profit > 0}>
          <span style={{ fontSize: '0.85em' }}>{entry.token}</span>
          <span>{Math.abs(profit).toFixed(4)}</span>
        </Profit>
        {md && profit > 0 && <div>({entry.multiplier}x)</div>}
      </div>
      <div style={{ fontSize: '0.8em', color: '#888' }}>
        {entry.timeAgo < 60 ? 'Just now' : entry.timeAgo < 3600 ? `${Math.floor(entry.timeAgo / 60)}m ago` : `${Math.floor(entry.timeAgo / 3600)}h ago`}
      </div>
    </Recent>
  )
}

export default function RecentPlays() {
  const events = useRecentPlays({ showAllPlatforms: false })
  const [selectedGame, setSelectedGame] = React.useState<GambaTransaction<'GameSettled'>>()
  const [apiFeed, setApiFeed] = React.useState<ApiFeedEntry[]>([])
  const [apiLoading, setApiLoading] = React.useState(false)
  const md = useMediaQuery('md')

  React.useEffect(() => {
    if (events.length > 0) return
    setApiLoading(true)
    fetch(`${API_BASE}/v1/rea/live-feed?limit=15`)
      .then(r => r.json())
      .then(data => {
        if (data.feed && data.feed.length > 0) setApiFeed(data.feed)
      })
      .catch(() => {})
      .finally(() => setApiLoading(false))
  }, [events.length])

  const hasNativeEvents = events.length > 0
  const hasApiFeed = apiFeed.length > 0
  const showSkeleton = !hasNativeEvents && !hasApiFeed && apiLoading

  return (
    <Container>
      {selectedGame && (
        <ShareModal event={selectedGame} onClose={() => setSelectedGame(undefined)} />
      )}

      {showSkeleton && Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} />)}

      {hasNativeEvents && events.map((tx) => (
        <Recent key={tx.signature} onClick={() => setSelectedGame(tx)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5em' }}>
            <RecentPlay event={tx} />
          </div>
          <TimeDiff time={tx.time} suffix={md ? 'ago' : ''} />
        </Recent>
      ))}

      {!hasNativeEvents && hasApiFeed && apiFeed.map((entry) => (
        <ApiFeedRow key={entry.signature} entry={entry} />
      ))}

      {!hasNativeEvents && !hasApiFeed && !apiLoading && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#6fb5a0', fontSize: '0.9rem' }}>
          Waiting for first plays on Select Casino — be the first!
        </div>
      )}

      <GambaUi.Button
        main
        onClick={() => window.open(SOLSCAN_PROGRAM)}
      >
        🔍 Verify Smart Contract on Solscan
      </GambaUi.Button>
    </Container>
  )
}
