import React from 'react'
import styled from 'styled-components'
import { GAMES } from '../../games'
import { GameCard } from './GameCard'

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--s4);
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Title = styled.h2`
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
`

const Tabs = styled.div`
  display: flex;
  gap: var(--s1);
`

const Tab = styled.button<{ $active?: boolean }>`
  all: unset;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  padding: var(--s1) var(--s2);
  border-radius: var(--r-chip);
  color: ${p => p.$active ? 'var(--gold)' : 'var(--text-dim)'};
  background: ${p => p.$active ? 'var(--gold-dim)' : 'transparent'};
  transition: color .15s, background .15s;
  &:hover {
    color: var(--text);
    background: var(--surface);
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(185px, 1fr));
  gap: 12px;
`

type FilterKey = 'all' | 'edge' | 'multiplayer'

interface DashboardProps {
  poolBalance: number
}

export default function Dashboard({ poolBalance }: DashboardProps) {
  const [filter, setFilter] = React.useState<FilterKey>('all')
  const maxBet = poolBalance * 0.005

  const games = React.useMemo(() => {
    if (filter === 'multiplayer') return GAMES.filter(g => g.meta.tag === 'Multiplayer')
    return GAMES
  }, [filter])

  return (
    <Section>
      <div id="originals-section" />
      <SectionHeader>
        <Title>Games</Title>
        <Tabs>
          <Tab $active={filter === 'all'} onClick={() => setFilter('all')}>All</Tab>
          <Tab $active={filter === 'edge'} onClick={() => setFilter('edge')}>High Edge</Tab>
          <Tab $active={filter === 'multiplayer'} onClick={() => setFilter('multiplayer')}>Multiplayer</Tab>
        </Tabs>
      </SectionHeader>
      <Grid>
        {games.map(game => (
          <GameCard key={game.id} game={game} maxBet={maxBet} />
        ))}
      </Grid>
    </Section>
  )
}
