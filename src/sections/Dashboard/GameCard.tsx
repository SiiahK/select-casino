import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { GameBundle } from 'gamba-react-ui-v2'
import GameGlyph from '../../components/GameGlyph'
import { formatSol } from '../../utils/format'

const EDGE_MAP: Record<string, number> = {
  dice: 2.0, slots: 3.0, flip: 2.0, hilo: 2.0, mines: 2.0,
  roulette: 2.7, plinko: 3.0, crash: 2.0, blackjack: 1.5,
  jackpot: 5.0, plinkorace: 3.0, pvpflip: 1.5,
}

const Card = styled(NavLink)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 148px;
  padding: 16px;
  border-radius: var(--r-card);
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--elev);
  text-decoration: none;
  color: inherit;
  transition: border-color .15s, background .15s;
  &:hover {
    border-color: var(--gold);
    background: var(--surface-2);
  }
  &:hover .card-glyph { color: var(--text); }
`

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`

const Tag = styled.span`
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gold);
  background: var(--gold-dim);
  padding: 2px 6px;
  border-radius: var(--r-chip);
`

const CardBottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const GameName = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: var(--text);
`

const MetaLine = styled.div`
  font-family: var(--font-num);
  font-variant-numeric: tabular-nums;
  font-size: 10px;
  color: var(--text-dim);
  letter-spacing: -0.01em;
`

export function GameCard({
  game,
  maxBet,
}: {
  game: GameBundle & { meta: { tag?: string; [key: string]: any } }
  maxBet: number
}) {
  const edge = EDGE_MAP[game.id] ?? 2.0
  const isMultiplayer = game.meta.tag === 'Multiplayer'

  return (
    <Card to={`/${game.id}`}>
      <CardTop>
        <GameGlyph
          name={game.id}
          size={24}
          className="card-glyph"
          style={{ color: 'var(--text-mid)', transition: 'color .15s' }}
        />
        {isMultiplayer ? (
          <Tag>PVP</Tag>
        ) : edge >= 3.0 ? (
          <Tag>High Edge</Tag>
        ) : null}
      </CardTop>
      <CardBottom>
        <GameName>{game.meta.name}</GameName>
        <MetaLine>
          EDGE {edge.toFixed(1)}% / MAX {formatSol(maxBet, 2)} SOL
        </MetaLine>
      </CardBottom>
    </Card>
  )
}
