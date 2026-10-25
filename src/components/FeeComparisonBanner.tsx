/**
 * WhaleTrustBar — "30-second trust" component visible before wallet connect.
 * Shows verified program ID, vault, fee structure, and rakeback info.
 * Optionally expands to show live leaderboard from the API.
 */
import React from 'react'
import styled from 'styled-components'
import { PLATFORM_CREATOR_FEE } from '../constants'

const API_BASE = 'https://api.tryaigility.com'
const PROGRAM_ID = 'Gamba2hK6KV3quKq854B3sQG1WMdq3zgQLPKqyK4qS18'
const VAULT = 'HBZPPQpwzmMNrvbT3SywLWQofpCzwdJFeGeG2CcZcT6j'

const Wrapper = styled.div`
  border-radius: 12px;
  background: linear-gradient(135deg, #0a1628 0%, #0d1f1a 100%);
  border: 1px solid #1a3a4a;
  overflow: hidden;
  margin-bottom: 8px;
`

const TrustRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px 16px;
  padding: 10px 16px;
  font-size: 13px;
  color: #c8ddd4;
  text-align: center;
`

const Badge = styled.span<{ $color?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: ${p => p.$color ?? 'rgba(61, 255, 168, 0.08)'};
  border: 1px solid ${p => p.$color ? p.$color.replace('0.08', '0.25') : 'rgba(61, 255, 168, 0.2)'};
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  color: #e6fff2;
  white-space: nowrap;
`

const CopyBtn = styled.button`
  background: none;
  border: none;
  color: #5af5a0;
  cursor: pointer;
  font-size: 11px;
  padding: 0 2px;
  opacity: 0.7;
  &:hover { opacity: 1; }
`

const ExpandBtn = styled.button`
  display: block;
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: none;
  border-top: 1px solid #1a3a4a;
  color: #6fb5a0;
  font-size: 12px;
  padding: 8px;
  cursor: pointer;
  &:hover { background: rgba(255, 255, 255, 0.06); color: #3dffa8; }
`

const LeaderboardPanel = styled.div`
  padding: 12px 16px;
  border-top: 1px solid #1a3a4a;
  font-size: 12px;
  max-height: 300px;
  overflow-y: auto;
`

const LbRow = styled.div<{ $highlight?: boolean }>`
  display: grid;
  grid-template-columns: 30px 1fr 80px 60px;
  gap: 8px;
  padding: 6px 0;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  color: ${p => p.$highlight ? '#3dffa8' : '#c8ddd4'};
  font-family: 'JetBrains Mono', monospace;
`

const TierBadge = styled.span<{ $tier: string }>`
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 3px;
  font-weight: 600;
  background: ${p => {
    switch (p.$tier) {
      case 'mega_whale': return 'rgba(255, 215, 0, 0.15)'
      case 'whale': return 'rgba(100, 149, 237, 0.15)'
      case 'dolphin': return 'rgba(0, 191, 255, 0.15)'
      default: return 'rgba(255,255,255,0.05)'
    }
  }};
  color: ${p => {
    switch (p.$tier) {
      case 'mega_whale': return '#ffd700'
      case 'whale': return '#6495ed'
      case 'dolphin': return '#00bfff'
      default: return '#888'
    }
  }};
`

interface LbEntry {
  rank: number
  wallet: string
  tier: string
  totalWagerSol: number
  plays: number
}

function useCopy() {
  const [copied, setCopied] = React.useState('')
  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label)
      setTimeout(() => setCopied(''), 1500)
    }).catch(() => {})
  }
  return { copied, copy }
}

export default function FeeComparisonBanner() {
  const [expanded, setExpanded] = React.useState(false)
  const [leaderboard, setLeaderboard] = React.useState<LbEntry[]>([])
  const [loading, setLoading] = React.useState(false)
  const { copied, copy } = useCopy()
  const pct = +(PLATFORM_CREATOR_FEE * 100).toFixed(2)

  React.useEffect(() => {
    if (!expanded) return
    setLoading(true)
    fetch(`${API_BASE}/v1/rea/leaderboard?limit=10&period=7d`)
      .then(r => r.json())
      .then(data => {
        if (data.leaderboard) setLeaderboard(data.leaderboard)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [expanded])

  return (
    <Wrapper role="region" aria-label="Platform trust verification">
      <TrustRow>
        <Badge>
          Program: {PROGRAM_ID.slice(0, 6)}…{PROGRAM_ID.slice(-4)}
          <CopyBtn onClick={() => copy(PROGRAM_ID, 'program')} title="Copy Program ID">
            {copied === 'program' ? '✓' : '⎘'}
          </CopyBtn>
        </Badge>
        <Badge>
          Vault: {VAULT.slice(0, 6)}…{VAULT.slice(-4)}
          <CopyBtn onClick={() => copy(VAULT, 'vault')} title="Copy Vault">
            {copied === 'vault' ? '✓' : '⎘'}
          </CopyBtn>
        </Badge>
        <Badge $color="rgba(59, 130, 246, 0.08)">
          {pct}% Fee
        </Badge>
        <Badge $color="rgba(61, 255, 168, 0.08)">
          25% Instant Rakeback
        </Badge>
        <Badge $color="rgba(245, 158, 11, 0.08)">
          0.1% Jackpot
        </Badge>
      </TrustRow>

      <ExpandBtn onClick={() => setExpanded(!expanded)}>
        {expanded ? '▲ Hide Leaderboard' : '▼ Leaderboard · Rakeback VIP · Provably Fair'}
      </ExpandBtn>

      {expanded && (
        <LeaderboardPanel>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '16px', color: '#6fb5a0' }}>Loading…</div>
          ) : leaderboard.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '16px', color: '#6fb5a0' }}>
              No plays yet — be the first whale 🐋
            </div>
          ) : (
            <>
              <LbRow style={{ fontWeight: 700, fontSize: '10px', color: '#6fb5a0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <span>#</span>
                <span>Wallet</span>
                <span style={{ textAlign: 'right' }}>Volume (SOL)</span>
                <span style={{ textAlign: 'right' }}>Plays</span>
              </LbRow>
              {leaderboard.map((entry) => (
                <LbRow key={entry.wallet} $highlight={entry.rank <= 3}>
                  <span>{entry.rank}</span>
                  <span>
                    {entry.wallet.slice(0, 4)}…{entry.wallet.slice(-4)}{' '}
                    <TierBadge $tier={entry.tier}>{entry.tier.replace('_', ' ')}</TierBadge>
                  </span>
                  <span style={{ textAlign: 'right' }}>{entry.totalWagerSol.toFixed(2)}</span>
                  <span style={{ textAlign: 'right' }}>{entry.plays}</span>
                </LbRow>
              ))}
            </>
          )}
          <div style={{ marginTop: '12px', padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', lineHeight: 1.6 }}>
            <div style={{ color: '#3dffa8', fontWeight: 600, marginBottom: '4px' }}>Fee Split Model</div>
            <div style={{ color: '#9fbfb0' }}>
              Organic: Treasury 75% · Rakeback 25%<br/>
              Referred: Treasury 55% · Rakeback 25% · Referral 20%<br/>
              Lossback: 3% of net losses (capped 10% of fees generated)
            </div>
          </div>
        </LeaderboardPanel>
      )}
    </Wrapper>
  )
}
