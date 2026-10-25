import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUserStore } from '../../hooks/useUserStore';

const BLINK_URL = 'https://dial.to/?action=solana-action:https%3A%2F%2Fapi.tryaigility.com%2Fapi%2Factions%2Fspin&cluster=mainnet-beta';

const WelcomeWrapper = styled.div`
  @keyframes welcome-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes backgroundGradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  background: linear-gradient(-45deg, #0ea5e9, #6366f1, #8b5cf6, #3b82f6, #06b6d4);
  background-size: 300% 300%;
  animation: welcome-fade-in 0.5s ease, backgroundGradient 30s ease infinite;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  text-align: center;
  filter: drop-shadow(0 4px 3px rgba(0,0,0,.07)) drop-shadow(0 2px 2px rgba(0,0,0,.06));
  @media (min-width: 800px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    align-items: center;
    text-align: left;
    padding: 40px;
    gap: 40px;
  }
`;

const WelcomeContent = styled.div`
  h1 {
    font-size: 1.75rem;
    margin: 0 0 8px 0;
    color: #ffffff;
    letter-spacing: -0.02em;
  }
  p {
    font-size: 0.95rem;
    color: #ffffffd1;
    margin: 0;
    line-height: 1.5;
  }
  @media (min-width: 800px) {
    h1 { font-size: 2.25rem; }
    p { font-size: 1.05rem; }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  @media (min-width: 800px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const ActionButton = styled.button`
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 0.85rem;
  font-weight: 600;
  background: #ffffffdf;
  color: black;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
  flex-grow: 1;
  text-align: center;
  &:hover {
    background: white;
    transform: translateY(-2px);
  }
  @media (min-width: 800px) {
    width: 100%;
    flex-grow: 0;
  }
`;

export function WelcomeBanner() {
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const { set: setUserModal } = useUserStore();
  const navigate = useNavigate();

  const handleCopyInvite = () => {
    setUserModal({ userModal: true });
    if (!wallet.connected) {
      walletModal.setVisible(true);
    }
  };

  return (
    <WelcomeWrapper>
      <WelcomeContent>
        <h1>SELECT — Instant On-Chain Solana Casino</h1>
        <p>
          Play directly against 18,000+ SOL Liquidity Pools · 33.88 SOL Live Jackpot · 1% Flat Fee with 25% Instant VIP Rakeback.
        </p>
      </WelcomeContent>
      <ButtonGroup>
        <ActionButton onClick={() => navigate('/flip')}>
          🪙 Flip 2x Now (Instant)
        </ActionButton>
        <ActionButton onClick={handleCopyInvite}>
          🔗 Copy VIP Referral (20% RevShare)
        </ActionButton>
        <ActionButton onClick={() => window.open(BLINK_URL, '_blank', 'noopener,noreferrer')}>
          ⚡ Play via Solana Blink
        </ActionButton>
      </ButtonGroup>
    </WelcomeWrapper>
  );
}
