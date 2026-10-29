import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useUserBalance,
} from 'gamba-react-ui-v2'
import { useMediaQuery } from '../hooks/useMediaQuery'
import TokenSelect from './TokenSelect'
import { UserButton } from './UserButton'
import { formatSol } from '../utils/format'

const Bar = styled.header`
  height: 64px;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--s4);
  position: sticky;
  top: 0;
  z-index: 100;
`

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: var(--s3);
`

const LogoLink = styled(NavLink)`
  display: flex;
  align-items: center;
  height: 28px;
  img { height: 100%; }
`

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: var(--s3);
`

const NetBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--text-dim);
`

const NetDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--win);
  display: inline-block;
`

const NavBtn = styled.button`
  all: unset;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-mid);
  padding: var(--s1) var(--s2);
  border-radius: var(--r-chip);
  transition: color .15s, background .15s;
  &:hover { color: var(--text); background: var(--surface); }
`

const BalanceDisplay = styled.span`
  font-family: var(--font-num);
  font-variant-numeric: tabular-nums;
  font-size: 13px;
  color: var(--text);
  letter-spacing: -0.01em;
`

export default function Header() {
  const balance = useUserBalance()
  const isDesktop = useMediaQuery('lg')

  return (
    <Bar>
      <Left>
        <LogoLink to="/">
          <img alt="SELECT" src="/logo.svg" />
        </LogoLink>
      </Left>

      <Right>
        <NetBadge>
          <NetDot /> MAINNET
        </NetBadge>

        {isDesktop && (
          <>
            <NavBtn onClick={() => document.getElementById('originals-section')?.scrollIntoView({ behavior: 'smooth' })}>
              Leaderboard
            </NavBtn>
            <NavBtn as="a" href="/proof" style={{ textDecoration: 'none' }}>
              Proof
            </NavBtn>
          </>
        )}

        {balance.balance > 0 && (
          <BalanceDisplay className="num">
            {formatSol(balance.balance)} SOL
          </BalanceDisplay>
        )}

        <TokenSelect />
        <UserButton />
      </Right>
    </Bar>
  )
}
