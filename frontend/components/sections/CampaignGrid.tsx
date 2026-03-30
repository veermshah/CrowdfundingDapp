"use client";

import { useMemo, useState } from "react";
import { featuredCampaigns } from "../../data/campaigns";
import { Pill } from "../ui/Pill";

function percentOfGoal(raisedEth: number, goalEth: number) {
  if (goalEth <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((raisedEth / goalEth) * 100));
}

type SortKey = "progress" | "deadline" | "backers";

export function CampaignGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortKey>("progress");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const categories = useMemo(
    () => ["All", ...new Set(featuredCampaigns.map((campaign) => campaign.category))],
    [],
  );

  const filteredCampaigns = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const next = featuredCampaigns
      .filter((campaign) => {
        const matchesCategory =
          selectedCategory === "All" || campaign.category === selectedCategory;
        const matchesVerified = !verifiedOnly || campaign.verified;
        const matchesSearch =
          normalizedQuery.length === 0 ||
          campaign.title.toLowerCase().includes(normalizedQuery) ||
          campaign.creator.toLowerCase().includes(normalizedQuery) ||
          campaign.summary.toLowerCase().includes(normalizedQuery);

        return matchesCategory && matchesVerified && matchesSearch;
      })
      .sort((left, right) => {
        if (sortBy === "deadline") {
          return left.daysLeft - right.daysLeft;
        }

        if (sortBy === "backers") {
          return right.backers - left.backers;
        }

        return (
          percentOfGoal(right.raisedEth, right.goalEth) -
          percentOfGoal(left.raisedEth, left.goalEth)
        );
      });

    return next;
  }, [searchQuery, selectedCategory, sortBy, verifiedOnly]);

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

      <div className="glass-panel space-y-4 rounded-3xl p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-[1.4fr_0.8fr_auto] md:items-center">
          <label className="block">
            <span className="sr-only">Search campaigns</span>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search campaigns, creators, or themes"
              className="w-full rounded-xl border border-white/15 bg-slate-950/50 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
            />
          </label>

          <label className="block">
            <span className="sr-only">Sort campaigns</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortKey)}
              className="w-full rounded-xl border border-white/15 bg-slate-950/50 px-4 py-2.5 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
            >
              <option value="progress">Sort: Progress</option>
              <option value="deadline">Sort: Closing Soon</option>
              <option value="backers">Sort: Most Backers</option>
            </select>
          </label>

          <label className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-slate-950/50 px-3 py-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(event) => setVerifiedOnly(event.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-slate-900 text-cyan-400"
            />
            Verified only
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                  isActive
                    ? "border-cyan-300/50 bg-cyan-300/15 text-cyan-100"
                    : "border-white/20 bg-white/5 text-slate-200 hover:border-white/35"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
          Showing {filteredCampaigns.length} of {featuredCampaigns.length} campaigns
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {filteredCampaigns.map((campaign, index) => {
          const progress = percentOfGoal(campaign.raisedEth, campaign.goalEth);

          return (
            <article
              key={campaign.id}
              className="glass-panel animate-reveal group flex h-full flex-col rounded-3xl p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-200/35 hover:shadow-[0_16px_40px_-24px_rgba(34,211,238,0.55)]"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div
                className={`mb-4 h-32 rounded-2xl border border-white/10 bg-gradient-to-br ${campaign.theme}`}
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
                <button
                  type="button"
                  className="rounded-full bg-white/10 px-3 py-1.5 font-semibold transition group-hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
                >
                  Contribute
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {filteredCampaigns.length === 0 ? (
        <div className="glass-panel rounded-3xl p-7 text-center">
          <p className="text-lg font-semibold text-white">No campaigns found</p>
          <p className="mt-2 text-sm text-slate-300">
            Try a different search term or clear the filters to see more projects.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setSortBy("progress");
              setVerifiedOnly(false);
            }}
            className="mt-4 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/50"
          >
            Reset Filters
          </button>
        </div>
      ) : null}
    </section>
  );
}