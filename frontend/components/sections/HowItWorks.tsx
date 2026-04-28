import { Pill } from "../ui/Pill";

const steps = [
  {
    step: "01",
    title: "Create a Campaign",
    description: "Set a title, goal amount, and deadline. Everything is stored on-chain.",
  },
  {
    step: "02",
    title: "Contributors Send ETH",
    description: "Anyone with a wallet can contribute directly — no accounts, no fees.",
  },
  {
    step: "03",
    title: "Goal Met → Creator Withdraws",
    description: "Once the goal is reached, the creator can withdraw funds to their wallet.",
  },
  {
    step: "04",
    title: "Goal Missed → Refunds Available",
    description: "If the deadline passes without reaching the goal, contributors get their ETH back.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="space-y-6">
      <div className="space-y-2">
        <Pill tone="accent">How It Works</Pill>
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">
          Simple. Transparent. Trustless.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {steps.map((step, index) => (
          <article
            key={step.step}
            className="glass-panel animate-reveal flex gap-5 rounded-2xl p-6"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <span className="mt-0.5 text-2xl font-bold text-slate-700">{step.step}</span>
            <div>
              <h3 className="font-semibold text-white">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-400">{step.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
