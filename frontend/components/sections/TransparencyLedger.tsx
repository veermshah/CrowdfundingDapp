import { Pill } from "../ui/Pill";

const milestones = [
  {
    title: "Milestone 1: Planning Approved",
    amount: "42 ETH released",
    status: "Completed",
  },
  {
    title: "Milestone 2: Vendor Procurement",
    amount: "36 ETH released",
    status: "Completed",
  },
  {
    title: "Milestone 3: Site Installation",
    amount: "Pending verifier signature",
    status: "In Review",
  },
  {
    title: "Milestone 4: Public Audit + Final Tranche",
    amount: "Locks until all proofs are posted",
    status: "Locked",
  },
];

export function TransparencyLedger() {
  return (
    <section id="ledger" className="grid gap-6 lg:items-stretch lg:grid-cols-[0.95fr_1.05fr]">
      <article className="glass-panel h-full rounded-3xl p-7 sm:p-8">
        <div className="self-start">
          <Pill tone="brand">Smart Contract Rules</Pill>
        </div>
        <h2 className="mt-4 text-3xl font-semibold text-white">
          Funds move only when rules are met
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Campaign contracts enforce milestone-based release logic. This means
          creators cannot arbitrarily withdraw funds and contributors can verify
          every payout step with transaction hashes.
        </p>

        <ul className="mt-6 space-y-3 text-sm text-slate-200">
          <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            Publicly auditable balance and transfer history
          </li>
          <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            Conditions enforced by immutable contract logic
          </li>
          <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            Wallet-native contributions with no centralized custody
          </li>
        </ul>
      </article>

      <article className="glass-panel h-full rounded-3xl p-6 sm:p-7">
        <div className="self-start">
          <Pill tone="brand">Milestone Ledger</Pill>
        </div>

        <div className="mt-5 space-y-4">
          {milestones.map((milestone) => (
            <article
              key={milestone.title}
              className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 transition duration-300 hover:border-cyan-200/35 hover:bg-slate-900/55"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-white">{milestone.title}</h3>
                <span
                  className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.12em] ${
                    milestone.status === "Completed"
                      ? "border-emerald-300/40 bg-emerald-400/10 text-emerald-100"
                      : milestone.status === "In Review"
                        ? "border-amber-300/40 bg-amber-400/10 text-amber-100"
                        : "border-white/15 bg-white/10 text-slate-200"
                  }`}
                >
                  {milestone.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-300">{milestone.amount}</p>
            </article>
          ))}
        </div>
      </article>
    </section>
  );
}