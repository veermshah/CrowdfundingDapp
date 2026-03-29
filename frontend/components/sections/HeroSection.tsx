import { Pill } from "../ui/Pill";

const trustSignals = [
  "No hidden platform skimming",
  "Milestone-based fund release",
  "Every transfer is publicly verifiable",
];

export function HeroSection() {
  return (
    <section className="grid items-center gap-10 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:pt-16">
      <div className="animate-reveal space-y-7">
        <Pill tone="brand">Decentralized Crowdfunding Protocol</Pill>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          Fund bold ideas with complete on-chain transparency.
        </h1>
        <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
          ChainFund lets creators raise crypto directly from supporters while
          enforcing trustless rules through Solidity contracts. Contributors can
          track campaign progress, wallet flows, and release conditions in real
          time.
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
            Explore Campaigns
          </button>
          <button className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/60 hover:bg-white/10">
            Start Your Campaign
          </button>
        </div>
        <ul className="grid gap-3 pt-2 text-sm text-slate-300 sm:grid-cols-3 sm:gap-4">
          {trustSignals.map((signal) => (
            <li key={signal} className="rounded-2xl border border-white/15 bg-white/5 p-4">
              {signal}
            </li>
          ))}
        </ul>
      </div>

      <div className="animate-drift glass-panel relative overflow-hidden rounded-3xl p-7 sm:p-8">
        <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-8 h-44 w-44 rounded-full bg-amber-300/25 blur-3xl" />

        <div className="relative space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-300">
              Featured Campaign
            </p>
            <Pill tone="accent">Audit Ready</Pill>
          </div>

          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            Community-Owned Microgrid Expansion
          </h2>

          <div className="space-y-3 rounded-2xl border border-white/15 bg-slate-950/40 p-5">
            <div className="flex items-end justify-between">
              <p className="text-sm text-slate-300">Raised</p>
              <p className="text-3xl font-semibold text-white">
                212.7 ETH
              </p>
            </div>
            <div className="h-2 rounded-full bg-slate-800">
              <div className="h-2 w-[72%] rounded-full bg-gradient-to-r from-cyan-400 to-sky-300" />
            </div>
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Goal: 295 ETH</span>
              <span>23 days left</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-slate-200">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
              <p className="text-slate-400">Backers</p>
              <p className="mt-1 text-2xl font-semibold">1,382</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
              <p className="text-slate-400">Milestones</p>
              <p className="mt-1 text-2xl font-semibold">4 / 5</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}