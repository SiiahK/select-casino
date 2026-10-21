import { PublicKey } from '@solana/web3.js'
import { PoolToken, TokenMeta, makeHeliusTokenFetcher } from 'gamba-react-ui-v2'

export const RPC_ENDPOINT = import.meta.env.VITE_RPC_ENDPOINT ?? 'https://api.mainnet-beta.solana.com'

// Squads vault — fees accumulate here under 2-of-3 multisig control
export const PLATFORM_CREATOR_ADDRESS = new PublicKey(
  'HBZPPQpwzmMNrvbT3SywLWQofpCzwdJFeGeG2CcZcT6j',
)

export const EXPLORER_URL = 'https://explorer.gamba.so'
export const PLATFORM_SHARABLE_URL = 'select-casino.vercel.app'

export const PLATFORM_CREATOR_FEE = 0.01 // 1%
export const MULTIPLAYER_FEE = 0.015
export const PLATFORM_JACKPOT_FEE = 0.001
export const PLATFORM_REFERRAL_FEE = 0.0025
export const PLATFORM_ALLOW_REFERRER_REMOVAL = true

const REG_MINT = 'AiqwHdAQaTRxYS3mAd83xZYEjikNkx1BMpQ26FkqHDp6'

const lp = (tokenMint: PublicKey | string, poolAuthority?: PublicKey | string): PoolToken => ({
  token: new PublicKey(tokenMint),
  authority: poolAuthority !== undefined ? new PublicKey(poolAuthority) : undefined,
})

export const POOLS = [
  // SOL — public Gamba pool (works immediately)
  lp('So11111111111111111111111111111111111111112'),
  // USDC — public Gamba pool
  lp('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
  // $REG — needs Gamba LP pool creation (Squads proposal) to activate
  lp(REG_MINT),
]

export const DEFAULT_POOL = POOLS[0]

export const TOKEN_METADATA: (Partial<TokenMeta> & {mint: PublicKey})[] = [
  {
    mint: new PublicKey(REG_MINT),
    name: 'Registry',
    symbol: 'REG',
    image: '/reg-token.png',
    baseWager: 1e6,
    decimals: 6,
    usdPrice: 0,
  },
]

export const TOS_HTML = `
  <p><b>1. Age Requirement:</b> Must be at least 18 years old.</p>
  <p><b>2. Legal Compliance:</b> Follow local laws responsibly.</p>
  <p><b>3. Risk Acknowledgement:</b> Games involve risk; no guaranteed winnings.</p>
  <p><b>4. No Warranty:</b> Games provided "as is"; operate randomly.</p>
  <p><b>5. Limitation of Liability:</b> We're not liable for damages.</p>
  <p><b>6. Licensing Disclaimer:</b> Not a licensed casino; for simulation only.</p>
  <p><b>7. Fair Play:</b> Games are conducted fairly and transparently.</p>
  <p><b>8. Data Privacy:</b> Your privacy is important to us.</p>
  <p><b>9. Responsible Gaming:</b> Play responsibly; seek help if needed.</p>
`

export const TOKEN_METADATA_FETCHER = (
  () => {
    if (import.meta.env.VITE_HELIUS_API_KEY) {
      return makeHeliusTokenFetcher(
        import.meta.env.VITE_HELIUS_API_KEY,
        { dollarBaseWager: 1 },
      )
    }
  }
)()

export const ENABLE_LEADERBOARD = true
export const ENABLE_TROLLBOX = false

export const FEATURED_GAME_INLINE = false
export const FEATURED_GAME_ID: string | undefined = 'jackpot'
