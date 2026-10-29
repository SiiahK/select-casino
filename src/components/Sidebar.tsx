import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import GameGlyph from './GameGlyph'
import { formatSol } from '../utils/format'

const API_BASE = 'https://api.tryaigility.com'

const Aside = styled.aside`
  width: 240px;
  min-height: calc(100vh - 64px);
  background: var(--bg);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: var(--s4) 0;
  position: sticky;
  top: 64px;
  overflow-y: auto;
  @media (max-width: 1024px) { display: none; }
`

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: var(--s3);
  padding: var(--s2) var(--s4);
  color: var(--text-mid);
  font-size: 13px;
  font-weight: 500;
  transition: color .15s, background .15s;
  text-decoration: none;
  &:hover {
    color: var(--text);
    background: var(--surface);
  }
  &.active {
    color: var(--gold);
    background: var(--gold-dim);
  }
  svg { flex-shrink: 0; }
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--border);
  margin: var(--s2) var(--s4);
`

const PoolBlock = styled.div`
  margin-top: auto;
  padding: var(--s4);
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: var(--s2);
`

const PoolRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const PoolLabel = styled.span`
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-dim);
`

const PoolValue = styled.span`
  font-family: var(--font-num);
  font-variant-numeric: tabular-nums;
  font-size: 13px;
  color: var(--text);
`

interface SidebarProps {
  poolBalance: number
}

export default function Sidebar({ poolBalance }: SidebarProps) {
  const location = useLocation()
  const maxBet = poolBalance * 0.005

  return (
    <Aside>
      <NavItem to="/" end>
        <GameGlyph name="lobby" size={18} />
        Lobby
      </NavItem>
      <NavItem to="/" className={location.pathname !== '/' && location.pathname !== '/leaderboard' ? 'active' : ''} onClick={(e) => { e.preventDefault(); document.getElementById('originals-section')?.scrollIntoView({ behavior: 'smooth' }) }}>
        <GameGlyph name="originals" size={18} />
        Originals
      </NavItem>
      <NavItem to="/pvpflip">
        <GameGlyph name="multiplayer" size={18} />
        Multiplayer
      </NavItem>

      <Divider />

      <NavItem to="/" onClick={(e) => { e.preventDefault() }}>
        <GameGlyph name="rewards" size={18} />
        Rewards
      </NavItem>
      <NavItem to="/" onClick={(e) => { e.preventDefault() }}>
        <GameGlyph name="rakeback" size={18} />
        Rakeback
      </NavItem>
      <NavItem to="/" onClick={(e) => { e.preventDefault() }}>
        <GameGlyph name="leaderboard" size={18} />
        Leaderboard
      </NavItem>

      <Divider />

      <NavItem to="/" onClick={(e) => { e.preventDefault() }}>
        <GameGlyph name="b2b" size={18} />
        B2B
      </NavItem>

      <PoolBlock>
        <PoolRow>
          <PoolLabel>Pool</PoolLabel>
          <PoolValue className="num">{formatSol(poolBalance, 1)} SOL</PoolValue>
        </PoolRow>
        <PoolRow>
          <PoolLabel>Max Bet</PoolLabel>
          <PoolValue className="num">{formatSol(maxBet, 3)} SOL</PoolValue>
        </PoolRow>
      </PoolBlock>
    </Aside>
  )
}
