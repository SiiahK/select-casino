import React from 'react'
import styled from 'styled-components'
import GameGlyph from './GameGlyph'
import { formatSol, truncateWallet } from '../utils/format'

const API_BASE = 'https://api.tryaigility.com'

const Rail = styled.aside`
  width: 280px;
  min-height: calc(100vh - 64px);
  background: var(--surface);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 64px;
  overflow: hidden;
  @media (max-width: 1280px) { display: none; }
`

const RailHeader = styled.div`
  padding: var(--s3) var(--s4);
  border-bottom: 1px solid var(--border);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-dim);
  display: flex;
  align-items: center;
  gap: var(--s2);
`

const Dot = styled.span<{ $live?: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${p => p.$live ? 'var(--win)' : 'var(--text-faint)'};
  display: inline-block;
`

const FeedList = styled.div`
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 2px; }
`

const FeedRow = styled.a`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--s1);
  padding: var(--s2) var(--s4);
  border-bottom: 1px solid var(--border);
  text-decoration: none;
  color: inherit;
  transition: background .1s;
  &:hover { background: var(--surface-2); }
`

const FeedLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--s2);
  min-width: 0;
`

const Wallet = styled.span`
  font-family: var(--font-num);
  font-variant-numeric: tabular-nums;
  font-size: 12px;
  color: var(--text-mid);
  white-space: nowrap;
`

const Amount = styled.span`
  font-family: var(--font-num);
  font-variant-numeric: tabular-nums;
  font-size: 12px;
  color: var(--text);
`

const Mult = styled.span<{ $win: boolean }>`
  font-family: var(--font-num);
  font-variant-numeric: tabular-nums;
  font-size: 12px;
  color: ${p => p.$win ? 'var(--win)' : 'var(--text-dim)'};
  text-align: right;
`

const RailFooter = styled.div`
  padding: var(--s3) var(--s4);
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: var(--s1);
`

const FooterRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 10px;
`

const FooterLabel = styled.span`
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-dim);
  font-weight: 500;
`

const FooterVal = styled.span`
  font-family: var(--font-num);
  color: var(--text-mid);
`

const VerifyLink = styled.a`
  font-size: 10px;
  color: var(--gold);
  text-decoration: none;
  &:hover { color: var(--gold-hi); }
`

interface FeedEntry {
  wallet: string
  game_id: string
  wager_raw: number
  payout_raw: number
  multiplier_bps: number
  tx_signature: string | null
}

interface LiveFeedRailProps {
  poolBalance: number
}

export default function LiveFeedRail({ poolBalance }: LiveFeedRailProps) {
  const [feed, setFeed] = React.useState<FeedEntry[]>([])
  const [live, setLive] = React.useState(false)
  const maxBet = poolBalance * 0.005

  React.useEffect(() => {
    fetch(`${API_BASE}/v1/rea/bets/recent?limit=30`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setFeed(data) })
      .catch(() => {})

    let es: EventSource | null = null
    try {
      es = new EventSource(`${API_BASE}/v1/rea/stream`)
      es.onopen = () => setLive(true)
      es.addEventListener('bet', (evt) => {
        try {
          const bet = JSON.parse(evt.data) as FeedEntry
          setFeed(prev => [bet, ...prev].slice(0, 50))
        } catch {}
      })
      es.onerror = () => setLive(false)
    } catch {}

    return () => { es?.close() }
  }, [])

  return (
    <Rail>
      <RailHeader>
        <Dot $live={live} /> Live Bets
      </RailHeader>

      <FeedList>
        {feed.length === 0 && (
          <div style={{ padding: 'var(--s4)', textAlign: 'center', color: 'var(--text-dim)', fontSize: '12px' }}>
            Waiting for bets...
          </div>
        )}
        {feed.map((entry, i) => {
          const wagerSol = entry.wager_raw / 1e9
          const payoutSol = entry.payout_raw / 1e9
          const isWin = payoutSol > wagerSol
          const mult = payoutSol > 0 ? (payoutSol / wagerSol) : 0

          return (
            <FeedRow
              key={`${entry.tx_signature || i}-${i}`}
              href={entry.tx_signature ? `https://solscan.io/tx/${entry.tx_signature}` : undefined}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FeedLeft>
                <GameGlyph name={entry.game_id} size={14} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
                <Wallet className="num">{truncateWallet(entry.wallet, 4, 2)}</Wallet>
                <Amount className="num">{formatSol(wagerSol, 3)}</Amount>
              </FeedLeft>
              <Mult $win={isWin} className="num">
                {isWin ? `${mult.toFixed(2)}x` : '—'}
              </Mult>
            </FeedRow>
          )
        })}
      </FeedList>

      <RailFooter>
        <FooterRow>
          <FooterLabel>Pool Balance</FooterLabel>
          <FooterVal className="num">{formatSol(poolBalance, 2)} SOL</FooterVal>
        </FooterRow>
        <FooterRow>
          <FooterLabel>Max Bet 0.5%</FooterLabel>
          <FooterVal className="num">{formatSol(maxBet, 4)} SOL</FooterVal>
        </FooterRow>
        <VerifyLink
          href="https://solscan.io/account/Gamba2hK6KV3quKq854B3sQG1WMdq3zgQLPKqyK4qS18"
          target="_blank"
          rel="noopener noreferrer"
        >
          Verify Contract
        </VerifyLink>
      </RailFooter>
    </Rail>
  )
}
