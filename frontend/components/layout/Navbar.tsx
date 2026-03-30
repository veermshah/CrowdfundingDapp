"use client";

import { useState } from "react";

const navLinks = [
  { href: "#campaigns", label: "Explore" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#ledger", label: "Transparency" },
  { href: "#activity", label: "Live Activity" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const walletLabel = isWalletConnected ? "0x7A3F...2d11" : "Connect Wallet";

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
          {navLinks.map((link) => (
            <a
              key={link.href}
              className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="hidden rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:inline-flex"
          >
            Create Campaign
          </button>

          <button
            type="button"
            onClick={() => setIsWalletConnected((prev) => !prev)}
            className="rounded-full bg-gradient-to-r from-cyan-400 to-sky-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/90 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            {walletLabel}
          </button>

          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-slate-100 transition hover:border-white/40 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 lg:hidden"
          >
            <span className="sr-only">Toggle menu</span>
            <span className="relative block h-4 w-4">
              <span
                className={`absolute left-0 top-0 h-0.5 w-4 bg-current transition ${
                  isMenuOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-0.5 w-4 bg-current transition ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-[14px] h-0.5 w-4 bg-current transition ${
                  isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`border-t border-white/10 px-6 py-4 sm:px-10 lg:hidden ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <nav className="grid gap-2 text-sm text-slate-200">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-xl px-3 py-2 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="mt-4 inline-flex rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/40"
        >
          Create Campaign
        </button>
      </div>
    </header>
  );
}