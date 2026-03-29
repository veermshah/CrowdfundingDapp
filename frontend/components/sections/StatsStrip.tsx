import { platformStats } from "../../data/campaigns";

export function StatsStrip() {
  return (
    <section className="glass-panel rounded-3xl p-4 sm:p-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {platformStats.map((stat, index) => (
          <article
            key={stat.label}
            className="animate-reveal rounded-2xl border border-white/10 bg-slate-900/50 px-5 py-4"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {stat.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}