import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HowItWorks } from '@/components/sections/HowItWorks'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-14">
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}
