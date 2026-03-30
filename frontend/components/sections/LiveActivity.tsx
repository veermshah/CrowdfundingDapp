"use client";

import { useEffect, useMemo, useState } from "react";
import { liveContributions } from "../../data/campaigns";

type SortMode = "latest" | "largest";

export function LiveActivity() {
  const [isPaused, setIsPaused] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("latest");
  const [minimumAmount, setMinimumAmount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const maxAmount = useMemo(
    () => Math.max(...liveContributions.map((entry) => entry.amountEth)),
    [],
  );

  useEffect(() => {
    if (isPaused) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const visibleRows = useMemo(() => {
    const rows = liveContributions
      .map((entry) => ({
        ...entry,
        secondsAgo: entry.secondsAgo + elapsedSeconds,
      }))
      .filter((entry) => entry.amountEth >= minimumAmount)
      .sort((left, right) => {
        if (sortMode === "largest") {
          return right.amountEth - left.amountEth;
        }

        return left.secondsAgo - right.secondsAgo;
      });

    return rows;
  }, [elapsedSeconds, minimumAmount, sortMode]);

  return (
    <section id="activity" className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Real-Time Tracking
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
            Recent on-chain contribution activity
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
              isPaused
                ? "border-amber-300/30 bg-amber-400/10 text-amber-100"
                : "border-emerald-300/30 bg-emerald-400/15 text-emerald-100"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isPaused ? "bg-amber-300" : "animate-pulse bg-emerald-300"
              }`}
            />
            {isPaused ? "Feed Paused" : "Live updates every block"}
          </span>

          <button
            type="button"
            onClick={() => setIsPaused((value) => !value)}
            className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-100 transition hover:border-white/40"
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-4 sm:p-5">
        <div className="mb-4 grid gap-3 sm:grid-cols-[0.9fr_1.1fr] sm:items-center">
          <label className="text-sm text-slate-200">
            <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-slate-400">
              Sort Feed
            </span>
            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              className="w-full rounded-xl border border-white/15 bg-slate-950/50 px-4 py-2.5 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
            >
              <option value="latest">Latest first</option>
              <option value="largest">Largest donation</option>
            </select>
          </label>

          <label className="text-sm text-slate-200">
            <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-slate-400">
              Minimum Contribution: {minimumAmount.toFixed(2)} ETH
            </span>
            <input
              type="range"
              min={0}
              max={maxAmount}
              step={0.01}
              value={minimumAmount}
              onChange={(event) => setMinimumAmount(Number(event.target.value))}
              className="w-full accent-cyan-400"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] table-auto border-separate border-spacing-y-2 text-left">
            <thead>
              <tr className="text-xs uppercase tracking-[0.12em] text-slate-400">
                <th className="px-3 py-2">Contributor</th>
                <th className="px-3 py-2">Campaign</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Tx Hash</th>
                <th className="px-3 py-2 text-right">When</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((entry) => (
                <tr
                  key={entry.txHash}
                  className="rounded-2xl bg-slate-900/60 text-sm text-slate-100 transition hover:bg-slate-900/80"
                >
                  <td className="rounded-l-xl px-3 py-3">{entry.contributor}</td>
                  <td className="px-3 py-3">{entry.campaign}</td>
                  <td className="px-3 py-3 font-semibold text-cyan-200">
                    {entry.amountEth} ETH
                  </td>
                  <td className="px-3 py-3 text-slate-300">{entry.txHash}</td>
                  <td className="rounded-r-xl px-3 py-3 text-right text-slate-300">
                    {entry.secondsAgo}s ago
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visibleRows.length === 0 ? (
          <p className="mt-4 text-center text-sm text-slate-300">
            No transactions match this amount filter.
          </p>
        ) : null}
      </div>
    </section>
  );
}