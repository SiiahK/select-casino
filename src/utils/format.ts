const LAMPORTS = 1e9

export function formatSol(lamportsOrSol: number, decimals = 3): string {
  const sol = lamportsOrSol > 1e6 ? lamportsOrSol / LAMPORTS : lamportsOrSol
  if (sol === 0) return '0'
  const str = sol.toFixed(decimals)
  // strip trailing zeros after decimal, keep at least one digit after dot
  return str.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '')
}

export function truncateWallet(wallet: string, start = 4, end = 2): string {
  if (wallet.length <= start + end + 2) return wallet
  return `${wallet.slice(0, start)}...${wallet.slice(-end)}`
}

export function truncateHash(hash: string, len = 8): string {
  if (hash.length <= len) return hash
  return `${hash.slice(0, len)}...`
}
