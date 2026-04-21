import { formatEther } from 'viem'

export function fmtEth(wei: bigint): string {
  if (wei === 0n) return '0'
  const eth = parseFloat(formatEther(wei))
  // Use 4 significant figures so small amounts still show up
  return parseFloat(eth.toPrecision(4)).toString()
}

export function fmtUsd(wei: bigint, ethPrice: number | null): string | null {
  if (ethPrice === null) return null
  const usd = parseFloat(formatEther(wei)) * ethPrice
  if (usd < 0.01) return '<$0.01'
  return '$' + usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
