import { Pill } from "../ui/Pill";

export function FinalCta() {
  return (
    <section className="glass-panel rounded-3xl p-8 sm:p-10">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <Pill tone="accent">Launch On Chain</Pill>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Build public trust by turning fundraising rules into transparent
            smart contracts.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            Whether you are a project creator or contributor, ChainFund gives
            you direct wallet interactions, publicly traceable fund flow, and
            milestone protection designed for accountability.
          </p>
        </div>

        <div className="rounded-3xl border border-white/15 bg-slate-950/50 p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Get Started
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
              Create Campaign
            </button>
            <button className="rounded-xl border border-white/25 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/50">
              Connect MetaMask
            </button>
            <button className="rounded-xl border border-white/25 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/50">
              Read Documentation
            </button>
            <button className="rounded-xl border border-white/25 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/50">
              View Deployed Contracts
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}