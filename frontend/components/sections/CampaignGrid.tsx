'use client'

import Link from 'next/link'
import { useReadContract, useReadContracts } from 'wagmi'
import { CROWDFUNDING_ABI, CROWDFUNDING_ADDRESS } from '@/lib/contract'
import { useEthPrice } from '@/lib/useEthPrice'
import { EthAmount } from '../ui/EthAmount'
import { Pill } from '../ui/Pill'

const CATEGORY_THEMES: Record<string, string> = {
  Environment: 'from-emerald-500/40 to-teal-400/20',
  Health: 'from-rose-500/40 to-pink-400/20',
  Education: 'from-violet-500/40 to-purple-400/20',
  Technology: 'from-cyan-500/40 to-sky-400/20',
  Community: 'from-amber-500/40 to-yellow-400/20',
  Other: 'from-slate-500/40 to-slate-400/20',
}

function pct(raised: bigint, goal: bigint) {
  if (goal === 0n) return 0
  return Math.min(100, Number((raised * 100n) / goal))
}

function timeLeft(deadline: bigint): string {
  const now = BigInt(Math.floor(Date.now() / 1000))
  if (deadline <= now) return 'Ended'
  const days = Math.floor(Number(deadline - now) / 86400)
  return days > 0 ? `${days}d left` : '< 1d left'
}

export function CampaignGrid() {
  const ethPrice = useEthPrice()
  const { data: count } = useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: 'campaignCount',
  })

  const ids = count ? Array.from({ length: Math.min(4, Number(count)) }, (_, i) => BigInt(i)) : []

  const { data: campaigns, isLoading } = useReadContracts({
    contracts: ids.map((id) => ({
      address: CROWDFUNDING_ADDRESS,
      abi: CROWDFUNDING_ABI,
      functionName: 'getCampaign' as const,
      args: [id] as [bigint],
    })),
    query: { enabled: ids.length > 0 },
  })

  const loaded = campaigns?.map((r) => r.result).filter((c): c is NonNullable<typeof c> => c != null)

  return (
    <section id="campaigns" className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">
          Top Campaigns
        </h2>
        <Link
          href="/explore"
          className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-slate-200 transition hover:border-white/40 hover:bg-white/5"
        >
          Browse All Campaigns
        </Link>
      </div>

      {isLoading && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-3xl bg-slate-800/60" />
          ))}
        </div>
      )}

      {!isLoading && (!loaded || loaded.length === 0) && (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-12 text-center text-slate-400">
          No campaigns yet.{' '}
          <Link href="/create" className="text-cyan-400 hover:underline">
            Create the first one →
          </Link>
        </div>
      )}

      {loaded && loaded.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {loaded.map((campaign, index) => {
            const progress = pct(campaign.raised, campaign.goalAmount)
            const theme = CATEGORY_THEMES[campaign.category] ?? CATEGORY_THEMES.Other

            return (
              <article
                key={campaign.id.toString()}
                className="glass-panel animate-reveal group flex h-full flex-col rounded-3xl p-5"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <div className={`mb-4 h-32 rounded-2xl bg-gradient-to-br ${theme} border border-white/10`} />

                <div className="mb-3 flex items-center justify-between">
                  <Pill tone="brand">{campaign.category}</Pill>
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-200">
                    On-chain
                  </span>
                </div>

                <div className="flex flex-1 flex-col">
                  <h3 className="text-xl font-semibold leading-snug text-white">{campaign.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">
                    by {campaign.creator.slice(0, 6)}…{campaign.creator.slice(-4)}
                  </p>
                  <p className="mt-3 min-h-[4.5rem] line-clamp-3 text-sm leading-6 text-slate-300/90">
                    {campaign.description}
                  </p>

                  <div className="mt-auto space-y-2 pt-4">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <EthAmount wei={campaign.raised} ethPrice={ethPrice} usdClassName="text-emerald-400" />
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.12em] text-slate-400">
                      <span>Goal <EthAmount wei={campaign.goalAmount} ethPrice={ethPrice} usdClassName="text-slate-300" /></span>
                      <span>{timeLeft(campaign.deadline)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-slate-300">
                  <span>{Number(campaign.backerCount)} backers</span>
                  <Link
                    href={`/campaign/${campaign.id}`}
                    className="rounded-full bg-white/10 px-3 py-1.5 font-semibold transition group-hover:bg-white/20"
                  >
                    Contribute
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
