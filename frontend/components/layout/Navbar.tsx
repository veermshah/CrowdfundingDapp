export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 sm:px-10 lg:px-14">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/90 to-sky-300/70 text-sm font-bold text-slate-950">
            CF
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">
              ChainFund
            </p>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Trustless Crowdfunding
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-sm text-slate-300 lg:flex">
          <a className="transition hover:text-white" href="#campaigns">
            Explore
          </a>
          <a className="transition hover:text-white" href="#how-it-works">
            How It Works
          </a>
          <a className="transition hover:text-white" href="#ledger">
            Transparency
          </a>
          <a className="transition hover:text-white" href="#activity">
            Live Activity
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/40 sm:inline-flex">
            Create Campaign
          </button>
          <button className="rounded-full bg-gradient-to-r from-cyan-400 to-sky-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110">
            Connect Wallet
          </button>
        </div>
      </div>
    </header>
  );
}