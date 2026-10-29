import React from 'react'

interface GlyphProps {
  name: string
  size?: number
  className?: string
  style?: React.CSSProperties
}

const paths: Record<string, React.ReactNode> = {
  dice: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="8" cy="8" r="1.25" fill="currentColor" />
      <circle cx="16" cy="8" r="1.25" fill="currentColor" />
      <circle cx="8" cy="16" r="1.25" fill="currentColor" />
      <circle cx="16" cy="16" r="1.25" fill="currentColor" />
      <circle cx="12" cy="12" r="1.25" fill="currentColor" />
    </>
  ),
  slots: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="8.5" y1="4" x2="8.5" y2="20" stroke="currentColor" strokeWidth="1.5" />
      <line x1="15.5" y1="4" x2="15.5" y2="20" stroke="currentColor" strokeWidth="1.5" />
      <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
    </>
  ),
  crash: (
    <polyline points="3,20 8,14 12,16 17,6 21,4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  flip: (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M12 3C7.58 3 4 6.58 4 11" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="10" x2="14" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="14" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  mines: (
    <>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="12" y1="4" x2="12" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="16" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4" y1="12" x2="8" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6.34" y1="6.34" x2="9.17" y2="9.17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14.83" y1="14.83" x2="17.66" y2="17.66" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  roulette: (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="12" y1="3" x2="12" y2="9" stroke="currentColor" strokeWidth="1" />
      <line x1="12" y1="15" x2="12" y2="21" stroke="currentColor" strokeWidth="1" />
      <line x1="3" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1" />
      <line x1="15" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1" />
    </>
  ),
  hilo: (
    <>
      <path d="M12 4L18 12L12 20L6 12Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <polyline points="9,14 12,10 15,14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  blackjack: (
    <>
      <rect x="4" y="2" width="12" height="17" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="8" y="5" width="12" height="17" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <text x="7" y="12" fontSize="7" fontWeight="bold" fill="currentColor" fontFamily="inherit">A</text>
    </>
  ),
  plinko: (
    <>
      <circle cx="12" cy="4" r="1.5" fill="currentColor" />
      <circle cx="8" cy="9" r="1" fill="currentColor" />
      <circle cx="16" cy="9" r="1" fill="currentColor" />
      <circle cx="6" cy="14" r="1" fill="currentColor" />
      <circle cx="12" cy="14" r="1" fill="currentColor" />
      <circle cx="18" cy="14" r="1" fill="currentColor" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="17" x2="7" y2="21" stroke="currentColor" strokeWidth="1" />
      <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="1" />
      <line x1="17" y1="17" x2="17" y2="21" stroke="currentColor" strokeWidth="1" />
    </>
  ),
  jackpot: (
    <>
      <path d="M12 2L14.4 8.6H21.4L15.8 12.8L18 19.4L12 15.2L6 19.4L8.2 12.8L2.6 8.6H9.6Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    </>
  ),
  plinkorace: (
    <>
      <circle cx="8" cy="4" r="1.5" fill="currentColor" />
      <circle cx="16" cy="4" r="1.5" fill="currentColor" />
      <circle cx="6" cy="9" r="1" fill="currentColor" />
      <circle cx="12" cy="9" r="1" fill="currentColor" />
      <circle cx="18" cy="9" r="1" fill="currentColor" />
      <path d="M3 20h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <polyline points="8,4 7,12 5,20" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" fill="none" />
      <polyline points="16,4 15,12 17,20" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" fill="none" />
    </>
  ),
  pvpflip: (
    <>
      <circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="11" y1="11" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <polyline points="11,13 13,13 13,11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  // Navigation icons
  lobby: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </>
  ),
  originals: (
    <>
      <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    </>
  ),
  multiplayer: (
    <>
      <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="17" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M15 20c0-2.5 1.5-4.5 4-4.5s3 2 3 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </>
  ),
  rewards: (
    <>
      <path d="M12 2L14.5 9H22L16 13.5L18.5 20.5L12 16L5.5 20.5L8 13.5L2 9H9.5Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    </>
  ),
  rakeback: (
    <>
      <path d="M4 12a8 8 0 1 1 16 0" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <polyline points="4,8 4,12 8,12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </>
  ),
  leaderboard: (
    <>
      <rect x="3" y="12" width="5" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="9.5" y="6" width="5" height="15" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="16" y="9" width="5" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="12" y1="3" x2="12" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  b2b: (
    <>
      <rect x="2" y="4" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="14" y="13" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M10 7.5h4l-4 9h4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  verify: (
    <>
      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25 5.25-1.1 9-6 9-11.25V7L12 2z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <polyline points="9,12 11,14 15,10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  'gamba-mark': (
    <>
      <path d="M4 8h4v8H4z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M10 4h4v16h-4z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M16 8h4v8h-4z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </>
  ),
}

export default function GameGlyph({ name, size = 24, className, style }: GlyphProps) {
  const content = paths[name] || paths.lobby
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
    >
      {content}
    </svg>
  )
}
