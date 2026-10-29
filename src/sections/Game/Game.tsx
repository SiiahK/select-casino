import React from 'react'
import { useParams } from 'react-router-dom'
import { GambaUi, useSoundStore } from 'gamba-react-ui-v2'
import { useTransactionError } from 'gamba-react-v2'
import styled from 'styled-components'

import { Icon } from '../../components/Icon'
import { Modal } from '../../components/Modal'
import GameGlyph from '../../components/GameGlyph'
import { GAMES } from '../../games'
import { useUserStore } from '../../hooks/useUserStore'
import { Container, Controls, IconButton, MetaControls, Screen, Splash } from './Game.styles'
import { LoadingBar } from './LoadingBar'
import { ProvablyFairModal } from './ProvablyFairModal'
import { TransactionModal } from './TransactionModal'
import { truncateHash } from '../../utils/format'

const POOL_ADDRESS = 'HBZPPQpwzmMNrvbT3SywLWQofpCzwdJFeGeG2CcZcT6j'
const GAMBA_PROGRAM = 'Gamba2hK6KV3quKq854B3sQG1WMdq3zgQLPKqyK4qS18'

const FairnessBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--s4);
  padding: var(--s2) var(--s4);
  border-radius: var(--r-input);
  background: var(--surface);
  border: 1px solid var(--border);
  font-size: 11px;
  color: var(--text-dim);
  flex-wrap: wrap;
`

const FLink = styled.a`
  color: var(--gold);
  text-decoration: none;
  &:hover { color: var(--gold-hi); }
`

function CustomError() {
  return (
    <GambaUi.Portal target="error">
      <GambaUi.Responsive>
        <h1>Something went wrong</h1>
        <p>Please try again</p>
      </GambaUi.Responsive>
    </GambaUi.Portal>
  )
}

function CustomRenderer() {
  const { game } = GambaUi.useGame()
  const [info, setInfo] = React.useState(false)
  const [provablyFair, setProvablyFair] = React.useState(false)
  const soundStore = useSoundStore()
  const firstTimePlaying = useUserStore(s => !s.gamesPlayed.includes(game.id))
  const markGameAsPlayed = useUserStore(s => () => s.markGameAsPlayed(game.id, true))
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    const t = setTimeout(() => setReady(true), 750)
    return () => clearTimeout(t)
  }, [])

  React.useEffect(() => {
    const t = setTimeout(() => setInfo(firstTimePlaying), 1000)
    return () => clearTimeout(t)
  }, [firstTimePlaying])

  const closeInfo = () => {
    markGameAsPlayed()
    setInfo(false)
  }

  useTransactionError(err => {
    if (err.message === 'NOT_CONNECTED') return
  })

  return (
    <>
      {info && (
        <Modal onClose={closeInfo}>
          <h1 style={{ display: 'flex', justifyContent: 'center' }}>
            <GameGlyph name={game.id} size={64} />
          </h1>
          <h2 style={{ textAlign: 'center' }}>{game.meta.name}</h2>
          <p>{game.meta.description}</p>
          <GambaUi.Button main onClick={closeInfo}>Play</GambaUi.Button>
        </Modal>
      )}
      {provablyFair && <ProvablyFairModal onClose={() => setProvablyFair(false)} />}

      <Container>
        <Screen>
          <Splash>
            <GameGlyph name={game.id} size={80} style={{ color: 'var(--text-mid)' }} />
          </Splash>
          <GambaUi.PortalTarget target="error" />
          {ready && <GambaUi.PortalTarget target="screen" />}

          <MetaControls>
            <IconButton onClick={() => setInfo(true)}><Icon.Info /></IconButton>
            <IconButton onClick={() => setProvablyFair(true)}><Icon.Fairness /></IconButton>
            <IconButton onClick={() => soundStore.set(soundStore.volume ? 0 : .5)}>
              {soundStore.volume ? <Icon.Volume /> : <Icon.VolumeMuted />}
            </IconButton>
          </MetaControls>
        </Screen>

        <LoadingBar />

        <Controls>
          <GambaUi.PortalTarget target="controls" />
          <GambaUi.PortalTarget target="play" />
        </Controls>
      </Container>

      <FairnessBar>
        <span className="num" style={{ color: 'var(--text-mid)' }}>
          SEED {truncateHash('verifiable', 10)}
        </span>
        <FLink
          href={`https://solscan.io/account/${GAMBA_PROGRAM}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Verify On-Chain
        </FLink>
        <FLink
          href={`https://solscan.io/account/${POOL_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="num"
        >
          POOL {truncateHash(POOL_ADDRESS, 8)}
        </FLink>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <GameGlyph name="gamba-mark" size={14} style={{ color: 'var(--text-dim)' }} />
          <span style={{ color: 'var(--text-dim)' }}>GAMBA v2</span>
        </span>
      </FairnessBar>
    </>
  )
}

interface GameProps {
  poolBalance?: number
}

export default function Game({ poolBalance }: GameProps) {
  const { gameId } = useParams()
  const game = GAMES.find(g => g.id === gameId)

  return (
    <>
      {game ? (
        <GambaUi.Game game={game} errorFallback={<CustomError />} children={<CustomRenderer />} />
      ) : (
        <h1 style={{ textAlign: 'center', color: 'var(--text-mid)' }}>Game not found</h1>
      )}
    </>
  )
}
