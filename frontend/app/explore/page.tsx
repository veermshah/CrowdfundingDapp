'use client'

import Link from 'next/link'
import { useReadContract, useReadContracts } from 'wagmi'
import { CROWDFUNDING_ABI, CROWDFUNDING_ADDRESS } from '@/lib/contract'
import { fmtEth } from '@/lib/format'
import { useEthPrice } from '@/lib/useEthPrice'
import { EthAmount } from '@/components/ui/EthAmount'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const CATEGORIES = ['All', 'Environment', 'Health', 'Education', 'Technology', 'Community', 'Other']

function ProgressBar({ raised, goal }: { raised: bigint; goal: bigint }) {
  const pct = goal === 0n ? 0 : Math.min(100, Number((raised * 100n) / goal))
  return (
    <div className="h-2 w-full rounded-full bg-slate-800">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-300 transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function timeLeft(deadline: bigint): string {
  const now = BigInt(Math.floor(Date.now() / 1000))
  if (deadline <= now) return 'Ended'
  const secs = Number(deadline - now)
  const days = Math.floor(secs / 86400)
  if (days > 0) return `${days}d left`
  const hrs = Math.floor(secs / 3600)
  return `${hrs}h left`
}

export default function ExplorePage() {
  const ethPrice = useEthPrice()
  const { data: count } = useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: 'campaignCount',
  })

  const ids = count ? Array.from({ length: Number(count) }, (_, i) => BigInt(i)) : []

  const { data: campaigns, isLoading } = useReadContracts({
    contracts: ids.map((id) => ({
      address: CROWDFUNDING_ADDRESS,
      abi: CROWDFUNDING_ABI,
      functionName: 'getCampaign' as const,
      args: [id] as [bigint],
    })),
    query: { enabled: ids.length > 0 },
  })

  const loaded = campaigns
    ?.map((r) => r.result)
    .filter((c): c is NonNullable<typeof c> => c != null)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-14">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Explore Campaigns</h1>
            <p className="mt-1 text-slate-400">
              {loaded ? `${loaded.length} campaign${loaded.length !== 1 ? 's' : ''} on-chain` : 'Loading…'}
            </p>
          </div>
          <Link
            href="/create"
            className="rounded-full bg-gradient-to-r from-cyan-400 to-sky-300 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110 text-center"
          >
            + Create Campaign
          </Link>
        </div>

        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-800/60" />
            ))}
          </div>
        )}

        {!isLoading && loaded?.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-16 text-center">
            <p className="text-xl text-slate-400">No campaigns yet.</p>
            <Link href="/create" className="mt-4 inline-block text-cyan-400 hover:underline">
              Be the first to create one →
            </Link>
          </div>
        )}

        {loaded && loaded.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loaded.map((campaign) => {
              const pct =
                campaign.goalAmount === 0n
                  ? 0
                  : Math.min(100, Number((campaign.raised * 100n) / campaign.goalAmount))
              const active = BigInt(Math.floor(Date.now() / 1000)) < campaign.deadline

              return (
                <Link
                  key={campaign.id.toString()}
                  href={`/campaign/${campaign.id}`}
                  className="group flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-6 transition hover:border-cyan-400/40 hover:bg-slate-900"
                >
                  <div className="flex items-start justify-between">
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                      {campaign.category}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        active
                          ? 'bg-cyan-400/10 text-cyan-400'
                          : 'bg-slate-700/40 text-slate-500'
                      }`}
                    >
                      {active ? 'Active' : 'Ended'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold leading-snug group-hover:text-cyan-300 transition">
                      {campaign.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-400">{campaign.description}</p>
                  </div>

                  <div className="mt-auto space-y-2">
                    <ProgressBar raised={campaign.raised} goal={campaign.goalAmount} />
                    <div className="flex items-center justify-between text-sm">
                      <EthAmount wei={campaign.raised} ethPrice={ethPrice} className="font-semibold text-cyan-300" usdClassName="text-emerald-400 font-semibold" />
                      <span className="text-slate-400">of <EthAmount wei={campaign.goalAmount} ethPrice={ethPrice} className="text-slate-400" usdClassName="text-slate-300" /> • {pct}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{Number(campaign.backerCount)} backer{campaign.backerCount !== 1n ? 's' : ''}</span>
                      <span>{timeLeft(campaign.deadline)}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
