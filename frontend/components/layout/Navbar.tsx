'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useAccount, useConnect, useDisconnect, useConnectors } from 'wagmi'

export function Navbar() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const connectors = useConnectors()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const shortAddress = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : null

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 sm:px-10 lg:px-14">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/90 to-sky-300/70 text-sm font-bold text-slate-950">
            CF
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">ChainFund</p>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Trustless Crowdfunding</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-slate-300 lg:flex">
          <Link className="transition hover:text-white" href="/explore">Explore Campaigns</Link>
          <Link className="transition hover:text-white" href="/how-it-works">How It Works</Link>
          <Link className="transition hover:text-white" href="/activity">Live Activity</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/create"
            className="hidden rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/40 sm:inline-flex"
          >
            Create Campaign
          </Link>

          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className="rounded-full bg-gradient-to-r from-cyan-400 to-sky-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            >
              {isConnected ? shortAddress : 'Connect Wallet'}
            </button>

            {open && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-xl">
                {isConnected && (
                  <>
                    <div className="border-b border-white/10 px-4 py-3">
                      <p className="text-xs text-slate-400">Connected</p>
                      <p className="mt-0.5 font-mono text-sm text-slate-200">{shortAddress}</p>
                    </div>
                    <div className="border-b border-white/10 px-4 py-2">
                      <p className="mb-1.5 text-xs uppercase tracking-widest text-slate-500">Switch wallet</p>
                      {connectors.map((connector) => (
                        <button
                          key={connector.id}
                          onClick={() => { connect({ connector }); setOpen(false) }}
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                        >
                          {connector.name}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => { disconnect(); setOpen(false) }}
                      className="flex w-full items-center px-4 py-3 text-sm text-red-400 transition hover:bg-white/5"
                    >
                      Disconnect
                    </button>
                  </>
                )}

                {!isConnected && (
                  <div className="px-4 py-2">
                    <p className="mb-1.5 text-xs uppercase tracking-widest text-slate-500">Choose wallet</p>
                    {connectors.map((connector) => (
                      <button
                        key={connector.id}
                        onClick={() => { connect({ connector }); setOpen(false) }}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                      >
                        {connector.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
