"use client";

import { useMemo, useState } from "react";
import { Pill } from "../ui/Pill";

type UserRole = "creator" | "supporter";

export function FinalCta() {
  const [role, setRole] = useState<UserRole>("creator");

  const roleContent = useMemo(
    () =>
      role === "creator"
        ? {
            label: "Creator flow",
            heading: "Prepare milestones and deploy your transparent campaign.",
            actions: [
              "Create Campaign",
              "Draft Milestone Rules",
              "Read Documentation",
              "View Deployed Contracts",
            ],
          }
        : {
            label: "Contributor flow",
            heading: "Connect your wallet and back campaigns with full auditability.",
            actions: [
              "Connect MetaMask",
              "Explore Campaigns",
              "Track Wallet Activity",
              "Review Contract Rules",
            ],
          },
    [role],
  );

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
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setRole("creator")}
              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                role === "creator"
                  ? "border-cyan-300/45 bg-cyan-300/15 text-cyan-100"
                  : "border-white/20 text-slate-200 hover:border-white/35"
              }`}
            >
              Creator
            </button>
            <button
              type="button"
              onClick={() => setRole("supporter")}
              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                role === "supporter"
                  ? "border-cyan-300/45 bg-cyan-300/15 text-cyan-100"
                  : "border-white/20 text-slate-200 hover:border-white/35"
              }`}
            >
              Contributor
            </button>
          </div>

          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-slate-400">
            {roleContent.label}
          </p>
          <p className="mt-2 text-sm text-slate-200">{roleContent.heading}</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {roleContent.actions.map((action, index) => (
              <button
                key={action}
                type="button"
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  index === 0
                    ? "bg-white text-slate-950 hover:bg-slate-200"
                    : "border border-white/25 text-slate-100 hover:border-white/50"
                }`}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}