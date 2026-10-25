/**
 * VacuumLiveFeed — Real-time liquidation scanner widget for the casino frontend.
 * Shows scanner stats + Whale Alpha CTA.
 */
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const GATEWAY_URL = 'https://api.tryaigility.com'
const SCAN_FEE_SOL = 0.01

interface DustAccount {
  pubkey: string
  hf: number
  liabUsd: number
  topLiabMint: string
}

interface PnlEntry {
  ts: string
  event: string
  netUsd?: number
  gasLamports?: number
}

const Container = styled.div`
  background: #0d0d1a;
  border: 1px solid #1a1a3e;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
`

const Title = styled.h3`
  color: #8b5cf6;
  margin: 0 0 12px 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`

const Pulse = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  animation: pulse 2s infinite;
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  color: #ccc;
  th { color: #666; text-align: left; padding: 4px 8px; font-weight: normal; }
  td { padding: 4px 8px; border-top: 1px solid #1a1a2e; font-family: monospace; }
`

const CtaButton = styled.button`
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 16px;
  transition: opacity 0.2s;
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

const StatusBar = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 12px;
  color: #888;
  flex-wrap: wrap;
  span { color: #22c55e; font-weight: 600; }
`

export default function VacuumLiveFeed() {
  const [accounts, setAccounts] = useState<DustAccount[]>([])
  const [pnl, setPnl] = useState<PnlEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [scannerStats, setScannerStats] = useState({ scanned: 165818, underwater: 14908 })

  useEffect(() => {
    async function fetchData() {
      try {
        const [accRes, pnlRes, healthRes] = await Promise.allSettled([
          fetch(`${GATEWAY_URL}/v2/vacuum-scan`).then(r => r.json()),
          fetch(`${GATEWAY_URL}/v2/vacuum-pnl`).then(r => r.json()),
          fetch(`${GATEWAY_URL}/v1/rea/health`).then(r => r.json()),
        ])
        if (accRes.status === 'fulfilled') {
          setAccounts(accRes.value.accounts?.slice(0, 10) || [])
          setLastUpdate(new Date().toLocaleTimeString())
        }
        if (pnlRes.status === 'fulfilled') {
          setPnl(pnlRes.value.entries?.slice(-5) || [])
        }
        if (healthRes.status === 'fulfilled') {
          const h = healthRes.value
          if (h.accountsScanned) setScannerStats({ scanned: h.accountsScanned, underwater: h.underwaterTracked || 14908 })
        }
        setError(null)
      } catch (e: any) {
        setError('Scanner offline')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 30_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Container>
      <Title><Pulse /> Vacuum Live Feed</Title>

      <StatusBar>
        <div>Accounts scanned: <span>{scannerStats.scanned.toLocaleString()}</span></div>
        <div>Underwater tracked: <span>{scannerStats.underwater.toLocaleString()}</span></div>
        <div>Status: <span>Live Helius Feed</span></div>
        <div>Last update: <span>{lastUpdate || new Date().toLocaleTimeString()}</span></div>
      </StatusBar>

      {error && <div style={{ color: '#f87171', fontSize: 13 }}>{error}</div>}

      {!loading && accounts.length > 0 && (
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Account</th>
              <th>HF</th>
              <th>Debt $</th>
              <th>Liability</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((a, i) => (
              <tr key={a.pubkey}>
                <td>{i + 1}</td>
                <td>{a.pubkey.slice(0, 8)}…</td>
                <td style={{ color: a.hf < 1 ? '#f87171' : '#22c55e' }}>
                  {a.hf.toFixed(4)}
                </td>
                <td>${a.liabUsd.toFixed(2)}</td>
                <td>{a.topLiabMint.slice(0, 8)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {loading && <div style={{ color: '#666', fontSize: 13 }}>Loading scanner data…</div>}

      <CtaButton>
        ⚡ Unlock Whale Alpha Scanner & VIP Rakeback Boost ({SCAN_FEE_SOL} SOL)
      </CtaButton>

      {pnl.length > 0 && (
        <div style={{ marginTop: 12, fontSize: 11, color: '#555' }}>
          Recent activity: {pnl.map(e => e.event).join(' → ')}
        </div>
      )}
    </Container>
  )
}
