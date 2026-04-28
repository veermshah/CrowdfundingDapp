'use client'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { LiveActivity } from '@/components/sections/LiveActivity'

export default function ActivityPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-14">
        <LiveActivity />
      </main>
      <Footer />
    </div>
  )
}
