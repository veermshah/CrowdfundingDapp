# ChainFund Frontend

Frontend for a decentralized crowdfunding app built with Next.js + React + Tailwind CSS.

The UI focuses on a transparent Web fundraising flow where campaign creation, contribution, and milestone fund release are intended to be enforced by Solidity smart contracts from the Hardhat workspace.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- ESLint 9

## Project Structure

```
app/
	globals.css                # global styles, motion helpers, visual theme
	layout.tsx                 # metadata + root layout
	page.tsx                   # homepage composition
components/
	layout/
		Navbar.tsx
		Footer.tsx
	sections/
		HeroSection.tsx
		StatsStrip.tsx
		CampaignGrid.tsx
		HowItWorks.tsx
		TransparencyLedger.tsx
		LiveActivity.tsx
		FinalCta.tsx
	ui/
		Pill.tsx
lib/
	contract.ts                # Crowdfunding ABI + contract address helpers
	format.ts                  # ETH / USD formatting helpers
	useEthPrice.ts             # live ETH price lookup for UI display
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy the env template and set the contract address plus RPC URL:

```bash
cp .env.example .env.local
```

Fill in `NEXT_PUBLIC_CROWDFUNDING_ADDRESS` with the deployed contract address.


3. Start local development:

```bash
npm run dev
```

4. Open:

```text
http://localhost:3000
```

## Available Scripts

- npm run dev: Start development server
- npm run build: Create production build
- npm run start: Start production server from built output
- npm run lint: Run ESLint checks


## Full DApp Flow

1. Install MetaMask in your browser.
2. Create a new wallet or import an existing one.
3. Make sure the wallet is on the same network as the deployed contract.
4. Open the app and click `Connect Wallet` in the navbar.
5. Pick the MetaMask account you want to use.
6. Create campaigns, contribute ETH, withdraw funds as the creator, or claim refunds after expiration.
