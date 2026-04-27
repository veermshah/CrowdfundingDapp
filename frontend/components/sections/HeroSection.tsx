'use client'

import Link from 'next/link'
import { useReadContract, useReadContracts } from 'wagmi'
import { CROWDFUNDING_ABI, CROWDFUNDING_ADDRESS } from '@/lib/contract'
import { fmtEth } from '@/lib/format'
import { useEthPrice } from '@/lib/useEthPrice'
import { EthAmount } from '../ui/EthAmount'
import { Pill } from '../ui/Pill'

function timeLeft(deadline: bigint): string {
  const now = BigInt(Math.floor(Date.now() / 1000))
  if (deadline <= now) return 'Ended'
  const days = Math.floor(Number(deadline - now) / 86400)
  return `${days}d left`
}

export function HeroSection() {
  const ethPrice = useEthPrice()
  const { data: count } = useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: 'campaignCount',
  })

  const { data: campaigns } = useReadContracts({
    contracts: [
      {
        address: CROWDFUNDING_ADDRESS,
        abi: CROWDFUNDING_ABI,
        functionName: 'getCampaign' as const,
        args: [0n],
      },
    ],
    query: { enabled: count != null && count > 0n },
  })

  const featured = campaigns?.[0]?.result
  const raisedPct = featured && featured.goalAmount > 0n
    ? Math.min(100, Number((featured.raised * 100n) / featured.goalAmount))
    : 0

  return (
    <section className="grid items-center gap-10 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:pt-16">
      <div className="animate-reveal space-y-6">
        <Pill tone="brand">Decentralized Crowdfunding on Ethereum</Pill>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          Fund bold ideas with complete on-chain transparency.
        </h1>
        <p className="max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
          Raise crypto directly from supporters. Smart contracts enforce every rule — no middlemen.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/explore"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Explore Campaigns
          </Link>
          <Link
            href="/create"
            className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/60 hover:bg-white/10"
          >
            Create Campaign
          </Link>
        </div>
      </div>

      <div className="animate-drift glass-panel relative overflow-hidden rounded-3xl p-7 sm:p-8">
        <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-8 h-44 w-44 rounded-full bg-amber-300/25 blur-3xl" />

        <div className="relative space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Featured Campaign</p>
            <Pill tone="accent">Live on-chain</Pill>
          </div>

          <h2 className="text-2xl font-semibold text-white">
            {featured ? featured.title : 'No campaigns yet — be the first!'}
          </h2>

          <div className="space-y-3 rounded-2xl border border-white/15 bg-slate-950/40 p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-slate-400">Raised</p>
              {featured
                ? <EthAmount wei={featured.raised} ethPrice={ethPrice} className="text-3xl font-semibold text-white" usdClassName="text-emerald-400 text-xl font-semibold" />
                : <p className="text-3xl font-semibold text-white">—</p>
              }
            </div>
            <div className="h-2 rounded-full bg-slate-800">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-300"
                style={{ width: `${raisedPct}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-slate-400">
              <span>{featured ? `Goal: ${fmtEth(featured.goalAmount)} ETH` : '—'}</span>
              <span>{featured ? timeLeft(featured.deadline) : '—'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-slate-200">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
              <p className="text-xs text-slate-400">Backers</p>
              <p className="mt-1 text-2xl font-semibold">{featured ? Number(featured.backerCount) : '—'}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
              <p className="text-xs text-slate-400">Campaigns</p>
              <p className="mt-1 text-2xl font-semibold">{count != null ? count.toString() : '—'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
