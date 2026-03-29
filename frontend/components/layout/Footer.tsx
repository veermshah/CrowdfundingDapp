export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/50">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 sm:px-10 lg:grid-cols-3 lg:px-14">
        <div>
          <p className="text-xl font-semibold">ChainFund</p>
          <p className="mt-2 max-w-sm text-sm text-slate-400">
            Transparent, milestone-based crowdfunding secured by Ethereum smart
            contracts and built for real-world impact.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Platform
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            <li>Launch Campaign</li>
            <li>Contribute With MetaMask</li>
            <li>Verify Milestone Payouts</li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Built With
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            <li>React + Tailwind CSS</li>
            <li>Solidity + Hardhat</li>
            <li>Public On-Chain Transaction History</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}