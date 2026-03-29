import { liveContributions } from "../../data/campaigns";

export function LiveActivity() {
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
        <span className="rounded-full border border-emerald-300/30 bg-emerald-400/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-100">
          Live updates every block
        </span>
      </div>

      <div className="glass-panel rounded-3xl p-4 sm:p-5">
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
              {liveContributions.map((entry) => (
                <tr key={entry.txHash} className="rounded-2xl bg-slate-900/60 text-sm text-slate-100">
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
      </div>
    </section>
  );
}