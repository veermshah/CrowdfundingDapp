import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/50">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 px-6 py-8 sm:flex-row sm:items-center sm:px-10 lg:px-14">
        <div>
          <p className="font-semibold text-white">ChainFund</p>
          <p className="mt-1 text-sm text-slate-500">Crowdfunding on Ethereum Sepolia</p>
        </div>

        <nav className="flex gap-6 text-sm text-slate-400">
          <Link href="/explore" className="hover:text-white transition">Explore</Link>
          <Link href="/create" className="hover:text-white transition">Create</Link>
          <a
            href={`https://sepolia.etherscan.io/address/${process.env.NEXT_PUBLIC_CROWDFUNDING_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            Contract ↗
          </a>
        </nav>
      </div>
    </footer>
  )
}
