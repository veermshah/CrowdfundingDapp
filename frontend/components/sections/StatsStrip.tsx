'use client'

import React from 'react'
import { useReadContract, useReadContracts } from 'wagmi'
import { CROWDFUNDING_ABI, CROWDFUNDING_ADDRESS } from '@/lib/contract'
import { useEthPrice } from '@/lib/useEthPrice'
import { EthAmount } from '@/components/ui/EthAmount'

export function StatsStrip() {
  const ethPrice = useEthPrice()
  const { data: count } = useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: 'campaignCount',
  })

  const ids = count ? Array.from({ length: Number(count) }, (_, i) => BigInt(i)) : []

  const { data: campaigns } = useReadContracts({
    contracts: ids.map((id) => ({
      address: CROWDFUNDING_ADDRESS,
      abi: CROWDFUNDING_ABI,
      functionName: 'getCampaign' as const,
      args: [id] as [bigint],
    })),
    query: { enabled: ids.length > 0 },
  })

  const loaded = campaigns?.map((r) => r.result).filter((c): c is NonNullable<typeof c> => c != null) ?? []

  const totalRaised = loaded.reduce((sum, c) => sum + c.raised, 0n)
  const totalBackers = loaded.reduce((sum, c) => sum + c.backerCount, 0n)

  const stats: { label: string; value: React.ReactNode }[] = [
    {
      label: 'ETH Raised',
      value: loaded.length > 0
        ? <EthAmount wei={totalRaised} ethPrice={ethPrice} className="text-3xl font-semibold text-white" usdClassName="text-emerald-400" />
        : '—',
    },
    {
      label: 'Active Campaigns',
      value: count != null ? count.toString() : '—',
    },
    {
      label: 'Total Backers',
      value: loaded.length > 0 ? totalBackers.toString() : '—',
    },
    {
      label: 'On-Chain',
      value: 'Ethereum',
    },
  ]

  return (
    <section className="glass-panel rounded-3xl p-4 sm:p-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <article
            key={stat.label}
            className="animate-reveal rounded-2xl border border-white/10 bg-slate-900/50 px-5 py-4"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-white leading-none">{stat.value}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
