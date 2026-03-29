import { featuredCampaigns } from "../../data/campaigns";
import { Pill } from "../ui/Pill";

function percentOfGoal(raisedEth: number, goalEth: number) {
  if (goalEth <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((raisedEth / goalEth) * 100));
}

export function CampaignGrid() {
  return (
    <section id="campaigns" className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Pill tone="neutral">Top Campaigns</Pill>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Fund projects with transparent execution
          </h2>
        </div>
        <button className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-slate-200 transition hover:border-white/40 hover:bg-white/5">
          Browse All Campaigns
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {featuredCampaigns.map((campaign, index) => {
          const progress = percentOfGoal(campaign.raisedEth, campaign.goalEth);

          return (
            <article
              key={campaign.id}
              className="glass-panel animate-reveal group flex h-full flex-col rounded-3xl p-5"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div
                className={`mb-4 h-32 rounded-2xl bg-gradient-to-br ${campaign.theme} border border-white/10`}
              />

              <div className="mb-3 flex items-center justify-between">
                <Pill tone={campaign.verified ? "brand" : "neutral"}>
                  {campaign.category}
                </Pill>
                {campaign.verified ? (
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-200">
                    Verified
                  </span>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col">
                <h3 className="text-xl font-semibold leading-snug text-white">
                  {campaign.title}
                </h3>
                <p className="mt-2 text-sm text-slate-300">by {campaign.creator}</p>
                <p className="mt-3 min-h-[4.5rem] text-sm leading-6 text-slate-300/90">
                  {campaign.summary}
                </p>

                <div className="mt-auto space-y-2 pt-4">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>{campaign.raisedEth.toFixed(1)} ETH raised</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.12em] text-slate-400">
                    <span>Goal {campaign.goalEth.toFixed(1)} ETH</span>
                    <span>{campaign.daysLeft} days left</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-slate-300">
                <span>{campaign.backers.toLocaleString()} backers</span>
                <button className="rounded-full bg-white/10 px-3 py-1.5 font-semibold transition group-hover:bg-white/20">
                  Contribute
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}