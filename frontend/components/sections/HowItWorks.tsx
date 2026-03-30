import { Pill } from "../ui/Pill";

const steps = [
  {
    title: "1. Creator Launches Campaign",
    description:
      "Project details, funding goal, and milestone conditions are stored in a Solidity smart contract.",
  },
  {
    title: "2. Donors Contribute via MetaMask",
    description:
      "Contributors send ETH directly from their wallets and instantly see transactions on-chain.",
  },
  {
    title: "3. Milestones Are Publicly Verified",
    description:
      "Funds remain governed by contract logic and are released only after milestone requirements are met.",
  },
  {
    title: "4. Everyone Audits Progress",
    description:
      "Campaign pages display transparent fund flow, progress bars, and the complete transaction ledger.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="space-y-6">
      <div className="space-y-3">
        <Pill tone="accent">How It Works</Pill>
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">
          A trust-minimized crowdfunding lifecycle
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {steps.map((step, index) => (
          <article
            key={step.title}
            className="glass-panel animate-reveal flex h-full flex-col rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-200/35 hover:shadow-[0_16px_40px_-24px_rgba(34,211,238,0.5)]"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <h3 className="text-xl font-semibold text-white">
              {step.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-7 text-slate-300">
              {step.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}