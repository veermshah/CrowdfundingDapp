'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { CROWDFUNDING_ABI, CROWDFUNDING_ADDRESS } from '@/lib/contract'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const CATEGORIES = ['Environment', 'Health', 'Education', 'Technology', 'Community', 'Other']

export default function CreatePage() {
  const router = useRouter()
  const { isConnected } = useAccount()

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Environment',
    goalEth: '',
    durationHours: '',
  })
  const [formError, setFormError] = useState('')

  const { writeContract, data: txHash, isPending, error: writeError } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  if (isSuccess) {
    router.push('/explore')
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')

    if (!form.title.trim()) { setFormError('Title is required.'); return }
    if (!form.description.trim()) { setFormError('Description is required.'); return }

    const goal = parseFloat(form.goalEth)
    if (isNaN(goal) || goal <= 0) { setFormError('Goal must be a positive number.'); return }

    const hours = parseFloat(form.durationHours)
    if (isNaN(hours) || hours <= 0) { setFormError('Duration must be greater than 0.'); return }
    const durationSeconds = BigInt(Math.round(hours * 3600))

    writeContract({
      address: CROWDFUNDING_ADDRESS,
      abi: CROWDFUNDING_ABI,
      functionName: 'createCampaign',
      args: [
        form.title,
        form.description,
        form.category,
        parseEther(form.goalEth),
        durationSeconds,
      ],
    })
  }

  const isSubmitting = isPending || isConfirming

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-16 sm:px-10">
        <div className="mb-8">
          <Link href="/explore" className="text-sm text-slate-400 hover:text-slate-200 transition">
            ← Back to explore
          </Link>
          <h1 className="mt-4 text-3xl font-bold">Create a Campaign</h1>
          <p className="mt-2 text-slate-400">
            Your campaign is stored on-chain. Once created, the goal and deadline are immutable.
          </p>
        </div>

        {!isConnected && (
          <div className="mb-6 rounded-xl border border-yellow-400/20 bg-yellow-400/5 px-6 py-4 text-yellow-300">
            Connect your wallet using the button in the navbar before creating a campaign.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Solar Rooftops for Schools"
                className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm placeholder-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your project, what the funds will be used for, and why it matters…"
                className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm placeholder-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Goal (ETH)</label>
                <input
                  name="goalEth"
                  value={form.goalEth}
                  onChange={handleChange}
                  type="number"
                  step="0.001"
                  min="0.001"
                  placeholder="10"
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm placeholder-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Duration (hours)</label>
                <input
                  name="durationHours"
                  value={form.durationHours}
                  onChange={handleChange}
                  type="number"
                  step="0.5"
                  min="0.5"
                  placeholder="24"
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm placeholder-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                />
              </div>
            </div>
          </div>

          {formError && (
            <p className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-400">
              {formError}
            </p>
          )}

          {writeError && (
            <p className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-400">
              {writeError.message.split('\n')[0]}
            </p>
          )}

          <button
            type="submit"
            disabled={!isConnected || isSubmitting}
            className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-300 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending
              ? 'Confirm in MetaMask…'
              : isConfirming
              ? 'Waiting for confirmation…'
              : 'Launch Campaign'}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  )
}
