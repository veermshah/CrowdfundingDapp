'use client'

import Link from 'next/link'
import { useConnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { Pill } from '../ui/Pill'

export function FinalCta() {
  const { connect } = useConnect()

  return (
    <section className="glass-panel rounded-3xl p-8 sm:p-10">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <Pill tone="accent">Get Started</Pill>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Ready to fund something real?
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Every transaction is public. Every rule is enforced by code.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/create"
            className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Create Campaign
          </Link>
          <button
            onClick={() => connect({ connector: injected() })}
            className="rounded-xl border border-white/25 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/50"
          >
            Connect Wallet
          </button>
          <Link
            href="/explore"
            className="rounded-xl border border-white/25 px-4 py-3 text-center text-sm font-semibold text-slate-100 transition hover:border-white/50"
          >
            Browse Campaigns
          </Link>
          <a
            href={`https://sepolia.etherscan.io/address/${process.env.NEXT_PUBLIC_CROWDFUNDING_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/25 px-4 py-3 text-center text-sm font-semibold text-slate-100 transition hover:border-white/50"
          >
            View Contract ↗
          </a>
        </div>
      </div>
    </section>
  )
}
