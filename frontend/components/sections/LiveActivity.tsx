'use client'

import { useState, useEffect } from 'react'
import { useWatchContractEvent, usePublicClient } from 'wagmi'
import { parseAbiItem, formatEther } from 'viem'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { CROWDFUNDING_ABI, CROWDFUNDING_ADDRESS } from '@/lib/contract'
import { fmtEth, fmtUsd } from '@/lib/format'
import { useEthPrice } from '@/lib/useEthPrice'
import { EthAmount } from '@/components/ui/EthAmount'

type ContribEntry = {
  campaignId: bigint
  contributor: `0x${string}`
  amount: bigint
  timestamp: number // unix seconds
}

type ChartPoint = {
  time: string
  ethTotal: number
  count: number
}

const CONTRIBUTED_EVENT = parseAbiItem(
  'event Contributed(uint256 indexed campaignId, address indexed contributor, uint256 amount)'
)

function timeAgo(ts: number): string {
  const secs = Math.floor(Date.now() / 1000) - ts
  if (secs < 60) return `${secs}s ago`
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
  return `${Math.floor(secs / 3600)}h ago`
}

function buildChartData(entries: ContribEntry[]): ChartPoint[] {
  if (entries.length === 0) return []
  const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp)
  let cumEth = 0
  let cumCount = 0
  return sorted.map((e) => {
    cumEth += parseFloat(formatEther(e.amount))
    cumCount += 1
    const d = new Date(e.timestamp * 1000)
    const label = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return { time: label, ethTotal: parseFloat(cumEth.toPrecision(4)), count: cumCount }
  })
}

export function LiveActivity() {
  const publicClient = usePublicClient()
  const ethPrice = useEthPrice()
  const [entries, setEntries] = useState<ContribEntry[]>([])
  const [loading, setLoading] = useState(true)

  // Load historical events on mount
  useEffect(() => {
    if (!publicClient) return
    setLoading(true)
    publicClient
      .getLogs({
        address: CROWDFUNDING_ADDRESS,
        event: CONTRIBUTED_EVENT,
        fromBlock: 0n,
        toBlock: 'latest',
      })
      .then(async (logs) => {
        // Fetch block timestamps in parallel
        const blocks = await Promise.all(
          logs.map((l) => publicClient.getBlock({ blockNumber: l.blockNumber! }))
        )
        const historical: ContribEntry[] = logs.map((l, i) => ({
          campaignId: l.args.campaignId!,
          contributor: l.args.contributor!,
          amount: l.args.amount!,
          timestamp: Number(blocks[i].timestamp),
        }))
        setEntries(historical)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [publicClient])

  // Append live events as they arrive
  useWatchContractEvent({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    eventName: 'Contributed',
    onLogs(logs) {
      const now = Math.floor(Date.now() / 1000)
      const incoming: ContribEntry[] = logs.map((l) => ({
        campaignId: l.args.campaignId!,
        contributor: l.args.contributor!,
        amount: l.args.amount!,
        timestamp: now,
      }))
      setEntries((prev) => [...prev, ...incoming])
    },
  })

  const chartData = buildChartData(entries)
  const recent = [...entries].sort((a, b) => b.timestamp - a.timestamp).slice(0, 8)
  const totalEth = entries.reduce((s, e) => s + e.amount, 0n)

  return (
    <section id="activity" className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Live Activity</p>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
            On-chain contribution activity
          </h2>
        </div>
        <span className="rounded-full border border-emerald-300/30 bg-emerald-400/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-100">
          Live · every block
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        {/* Chart */}
        <div className="glass-panel rounded-3xl p-6">
          <div className="mb-4 flex items-baseline gap-3">
            <p className="text-2xl font-semibold text-white">
              {fmtEth(totalEth)} ETH
            </p>
            {fmtUsd(totalEth, ethPrice) && (
              <p className="text-sm text-slate-400">≈ {fmtUsd(totalEth, ethPrice)}</p>
            )}
            <p className="ml-auto text-xs text-slate-500">{entries.length} total contribution{entries.length !== 1 ? 's' : ''}</p>
          </div>

          {loading && (
            <div className="flex h-48 items-center justify-center text-sm text-slate-500">
              Loading history…
            </div>
          )}

          {!loading && chartData.length === 0 && (
            <div className="flex h-48 items-center justify-center text-sm text-slate-500">
              No contributions yet — the chart will populate live soon.
            </div>
          )}

          {!loading && chartData.length > 0 && (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="ethGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={48}
                  tickFormatter={(v) => `${v} ETH`}
                />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                  labelStyle={{ color: '#94a3b8', fontSize: 11 }}
                  itemStyle={{ color: '#67e8f9' }}
                  formatter={(value) => [`${value} ETH`, 'Cumulative']}
                />
                <Area
                  type="monotone"
                  dataKey="ethTotal"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  fill="url(#ethGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#22d3ee' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent contributions feed */}
        <div className="glass-panel rounded-3xl p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">Recent</p>

          {loading && (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded-xl bg-slate-800/60" />
              ))}
            </div>
          )}

          {!loading && recent.length === 0 && (
            <p className="py-6 text-center text-sm text-slate-500">
              Listening for contributions…
            </p>
          )}

          {!loading && recent.length > 0 && (
            <ul className="space-y-3">
              {recent.map((entry, i) => {
                return (
                  <li key={i} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-xs text-slate-300">
                        {entry.contributor.slice(0, 8)}…{entry.contributor.slice(-4)}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Campaign #{entry.campaignId.toString()} · {timeAgo(entry.timestamp)}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <EthAmount wei={entry.amount} ethPrice={ethPrice} prefix="+" className="text-sm font-semibold text-cyan-300" usdClassName="text-emerald-400 font-semibold" />
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
