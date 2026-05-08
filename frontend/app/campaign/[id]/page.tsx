'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useWatchContractEvent,
  usePublicClient,
} from 'wagmi'
import { parseEther, getAddress, parseAbiItem } from 'viem'
import { CROWDFUNDING_ABI, CROWDFUNDING_ADDRESS } from '@/lib/contract'
import { fmtEth, fmtUsd } from '@/lib/format'
import { useEthPrice } from '@/lib/useEthPrice'
import { EthAmount } from '@/components/ui/EthAmount'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

function ProgressBar({ raised, goal, ethPrice }: { raised: bigint; goal: bigint; ethPrice: number | null }) {
  const pct = goal === 0n ? 0 : Math.min(100, Number((raised * 100n) / goal))
  return (
    <div className="space-y-1.5">
      <div className="h-3 w-full rounded-full bg-slate-800">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-sky-300 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-sm">
        <div className="flex items-center gap-1.5">
          <EthAmount wei={raised} ethPrice={ethPrice} className="font-semibold text-cyan-300" usdClassName="text-emerald-400 font-semibold" />
          <span className="text-slate-400">raised</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <span>{pct}% of</span>
          <EthAmount wei={goal} ethPrice={ethPrice} className="text-slate-400" usdClassName="text-slate-300" />
        </div>
      </div>
    </div>
  )
}

function timeLeft(deadline: bigint): string {
  const now = BigInt(Math.floor(Date.now() / 1000))
  if (deadline <= now) return 'Campaign ended'
  const secs = Number(deadline - now)
  const days = Math.floor(secs / 86400)
  if (days > 0) return `${days} day${days !== 1 ? 's' : ''} remaining`
  const hrs = Math.floor(secs / 3600)
  return `${hrs} hour${hrs !== 1 ? 's' : ''} remaining`
}

const CONTRIBUTED_EVENT = parseAbiItem(
  'event Contributed(uint256 indexed campaignId, address indexed contributor, uint256 amount)'
)

const REFUNDED_EVENT = parseAbiItem(
  'event Refunded(uint256 indexed campaignId, address indexed contributor, uint256 amount)'
)

export default function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const campaignId = BigInt(id)

  const { address } = useAccount()
  const publicClient = usePublicClient()
  const ethPrice = useEthPrice()
  const now = BigInt(Math.floor(Date.now() / 1000))

  const [ethInput, setEthInput] = useState('')
  const [inputError, setInputError] = useState('')

  const [donors, setDonors] = useState<Map<string, bigint>>(new Map())
  const [donorsLoading, setDonorsLoading] = useState(true)
  const [refunds, setRefunds] = useState<Map<string, bigint>>(new Map())
  const [refundsLoading, setRefundsLoading] = useState(true)

  useEffect(() => {
    if (!publicClient) return
    setDonorsLoading(true)
    setRefundsLoading(true)

    Promise.all([
      publicClient.getLogs({
        address: CROWDFUNDING_ADDRESS,
        event: CONTRIBUTED_EVENT,
        args: { campaignId },
        fromBlock: 0n,
        toBlock: 'latest',
      }),
      publicClient.getLogs({
        address: CROWDFUNDING_ADDRESS,
        event: REFUNDED_EVENT,
        args: { campaignId },
        fromBlock: 0n,
        toBlock: 'latest',
      }),
    ])
      .then(([contribLogs, refundLogs]) => {
        const contribMap = new Map<string, bigint>()
        for (const log of contribLogs) {
          const addr = getAddress(log.args.contributor!)
          contribMap.set(addr, (contribMap.get(addr) ?? 0n) + log.args.amount!)
        }
        setDonors(contribMap)

        const refundMap = new Map<string, bigint>()
        for (const r of refundLogs) {
          const addr = getAddress(r.args.contributor!)
          refundMap.set(addr, (refundMap.get(addr) ?? 0n) + r.args.amount!)
        }
        setRefunds(refundMap)
      })
      .catch(() => {
        setDonors(new Map())
        setRefunds(new Map())
      })
      .finally(() => {
        setDonorsLoading(false)
        setRefundsLoading(false)
      })
  }, [publicClient, campaignId.toString()])

  useWatchContractEvent({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    eventName: 'Contributed',
    onLogs(logs) {
      const matching = logs.filter((l) => l.args.campaignId === campaignId)
      if (matching.length === 0) return
      setDonors((prev) => {
        const next = new Map(prev)
        for (const log of matching) {
          const addr = getAddress(log.args.contributor!)
          next.set(addr, (next.get(addr) ?? 0n) + log.args.amount!)
        }
        return next
      })
      refetch()
    },
  })

  const {
    data: campaign,
    isLoading,
    refetch,
  } = useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: 'getCampaign',
    args: [campaignId],
  })

  const { data: myContribution } = useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: 'getContribution',
    args: [campaignId, address ?? '0x0000000000000000000000000000000000000000'],
    query: { enabled: !!address },
  })

  const {
    writeContract,
    data: txHash,
    isPending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  if (isSuccess) {
    refetch()
    resetWrite()
  }

  function handleContribute(e: React.FormEvent) {
    e.preventDefault()
    setInputError('')
    const val = parseFloat(ethInput)
    if (isNaN(val) || val <= 0) { setInputError('Enter a positive ETH amount.'); return }
    writeContract({
      address: CROWDFUNDING_ADDRESS,
      abi: CROWDFUNDING_ABI,
      functionName: 'contribute',
      args: [campaignId],
      value: parseEther(ethInput),
    })
  }

  function handleWithdraw() {
    writeContract({ address: CROWDFUNDING_ADDRESS, abi: CROWDFUNDING_ABI, functionName: 'withdrawFunds', args: [campaignId] })
  }

  function handleRefund() {
    writeContract({ address: CROWDFUNDING_ADDRESS, abi: CROWDFUNDING_ABI, functionName: 'refund', args: [campaignId] })
  }

  const isSubmitting = isPending || isConfirming

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-16">
          <div className="h-96 animate-pulse rounded-2xl bg-slate-800/60" />
        </main>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-16 text-center">
          <p className="text-xl text-slate-400">Campaign not found.</p>
          <Link href="/explore" className="mt-4 inline-block text-cyan-400 hover:underline">← Back to explore</Link>
        </main>
      </div>
    )
  }

  const isActive = now < campaign.deadline
  const goalMet = campaign.raised >= campaign.goalAmount
  const isCreator = address && getAddress(address) === getAddress(campaign.creator)
  const canWithdraw = isCreator && goalMet && !campaign.withdrawn
  const canRefund = !isActive && !goalMet && myContribution && myContribution > 0n

  // Sort donors by amount descending
  const donorList = [...donors.entries()].sort((a, b) => (b[1] > a[1] ? 1 : -1))
  const refundList = [...refunds.entries()].sort((a, b) => (b[1] > a[1] ? 1 : -1))

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
        <Link href="/explore" className="mb-8 inline-block text-sm text-slate-400 hover:text-slate-200 transition">
          ← Back to explore
        </Link>

        {/* Two-column layout on large screens */}
        <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">

          {/* Left column */}
          <div className="space-y-6">
            {/* Header */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                  {campaign.category}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${isActive ? 'bg-cyan-400/10 text-cyan-400' : 'bg-slate-700/40 text-slate-500'}`}>
                  {isActive ? 'Active' : 'Ended'}
                </span>
                {goalMet && (
                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-400">
                    Goal Reached
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold">{campaign.title}</h1>
              <p className="mt-3 leading-relaxed text-slate-300">{campaign.description}</p>
              <p className="mt-3 font-mono text-xs text-slate-500">
                Creator: <span className="text-slate-400">{campaign.creator.slice(0, 10)}…{campaign.creator.slice(-6)}</span>
              </p>
            </div>

            {/* Progress */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 space-y-4">
              <ProgressBar raised={campaign.raised} goal={campaign.goalAmount} ethPrice={ethPrice} />
              <div className="flex justify-between text-sm text-slate-400">
                <span>{Number(campaign.backerCount)} backer{campaign.backerCount !== 1n ? 's' : ''}</span>
                <span>{timeLeft(campaign.deadline)}</span>
              </div>
            </div>

            {/* Contribute */}
            {isActive && (
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8">
                <h2 className="mb-4 text-lg font-semibold">Contribute ETH</h2>
                <form onSubmit={handleContribute} className="flex gap-3">
                  <input
                    value={ethInput}
                    onChange={(e) => setEthInput(e.target.value)}
                    type="number"
                    step="any"
                    placeholder="0.00001 ETH"
                    className="flex-1 rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm placeholder-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !address}
                    className="rounded-full bg-gradient-to-r from-cyan-400 to-sky-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isPending ? 'Confirm…' : isConfirming ? 'Confirming…' : 'Contribute'}
                  </button>
                </form>
                {!address && <p className="mt-2 text-xs text-slate-500">Connect your wallet to contribute.</p>}
                {inputError && <p className="mt-2 text-xs text-red-400">{inputError}</p>}
              </div>
            )}

            {/* Withdraw */}
            {canWithdraw && (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-8">
                <h2 className="mb-2 text-lg font-semibold text-emerald-300">Withdraw Funds</h2>
                <p className="mb-4 text-sm text-slate-400">
                  Goal reached. Withdraw <strong>{fmtEth(campaign.raised)} ETH</strong>{fmtUsd(campaign.raised, ethPrice) && <> ({fmtUsd(campaign.raised, ethPrice)})</>} to your wallet.
                </p>
                <button
                  onClick={handleWithdraw}
                  disabled={isSubmitting}
                  className="rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'Confirming…' : 'Withdraw Funds'}
                </button>
              </div>
            )}

            {/* Refund */}
            {canRefund && (
              <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-8">
                <h2 className="mb-2 text-lg font-semibold text-yellow-300">Claim Refund</h2>
                <p className="mb-4 text-sm text-slate-400">
                  Campaign ended without reaching goal. Reclaim <strong>{fmtEth(myContribution!)} ETH</strong>{fmtUsd(myContribution!, ethPrice) && <> ({fmtUsd(myContribution!, ethPrice)})</>}.
                </p>
                <button
                  onClick={handleRefund}
                  disabled={isSubmitting}
                  className="rounded-full bg-yellow-400 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-yellow-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'Confirming…' : 'Get Refund'}
                </button>
              </div>
            )}

            {writeError && (
              <p className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-400">
                {writeError.message.split('\n')[0]}
              </p>
            )}
          </div>

          {/* Right column — Donors */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 lg:sticky lg:top-24">
            <div className="border-b border-white/10 px-6 py-4">
              <h2 className="font-semibold text-white">Donors</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {donorsLoading ? 'Loading…' : `${donorList.length} unique wallet${donorList.length !== 1 ? 's' : ''}`}
              </p>
            </div>

            <div className="divide-y divide-white/5 max-h-[480px] overflow-y-auto">
              {donorsLoading && (
                <div className="space-y-3 p-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 animate-pulse rounded-lg bg-slate-800/60" />
                  ))}
                </div>
              )}

              {!donorsLoading && donorList.length === 0 && (
                <p className="px-6 py-8 text-center text-sm text-slate-500">No contributions yet.</p>
              )}

              {!donorsLoading && donorList.map(([addr, total]) => {
                const isYou = address && getAddress(address) === addr
                const usd = fmtUsd(total, ethPrice)
                return (
                  <div key={addr} className="flex items-center justify-between gap-3 px-6 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-xs text-slate-300">
                        {addr.slice(0, 8)}…{addr.slice(-6)}
                      </p>
                      {isYou && (
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400">You</span>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-cyan-300">{fmtEth(total)} ETH</p>
                      {usd && <p className="text-xs text-slate-500">{usd}</p>}
                    </div>
                  </div>
                )
              })}
            </div>

            {!isActive && (
              <div className="border-t border-white/10">
                <div className="border-b border-white/10 px-6 py-4">
                  <h2 className="font-semibold text-white">Refunds claimed</h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {refundsLoading ? 'Loading…' : `${refundList.length} wallet${refundList.length !== 1 ? 's' : ''} claimed refunds`}
                  </p>
                </div>

                <div className="divide-y divide-white/5 max-h-[320px] overflow-y-auto">
                  {refundsLoading && (
                    <div className="space-y-3 p-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-8 animate-pulse rounded-lg bg-slate-800/60" />
                      ))}
                    </div>
                  )}

                  {!refundsLoading && refundList.length === 0 && (
                    <p className="px-6 py-8 text-center text-sm text-slate-500">No refunds claimed yet.</p>
                  )}

                  {!refundsLoading && refundList.map(([addr, total]) => {
                    const usd = fmtUsd(total, ethPrice)
                    return (
                      <div key={addr} className="flex items-center justify-between gap-3 px-6 py-3">
                        <div className="min-w-0">
                          <p className="truncate font-mono text-xs text-slate-300">
                            {addr.slice(0, 8)}…{addr.slice(-6)}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-semibold text-yellow-300">{fmtEth(total)} ETH</p>
                          {usd && <p className="text-xs text-slate-500">{usd}</p>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
