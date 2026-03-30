# ChainFund Frontend

Frontend for a decentralized crowdfunding app built with Next.js + React + Tailwind CSS.

The UI focuses on a transparent Web3 fundraising flow where campaign creation, contribution, and milestone fund release are intended to be enforced by Solidity smart contracts from the Hardhat workspace.

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
data/
	campaigns.ts               # temporary mock data for campaigns + live activity
types/
	campaign.ts                # shared campaign-related TypeScript types
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start local development:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

## Available Scripts

- npm run dev: Start development server
- npm run build: Create production build
- npm run start: Start production server from built output
- npm run lint: Run ESLint checks

## Current Status

- The UI is responsive and includes interactive sections.
- Campaign discovery supports search, category filters, verified toggle, and sorting.
- Live activity includes pause/resume, sorting, and amount filtering controls.
- Accessibility polish includes stronger focus states and reduced-motion support.
- Data currently comes from local mock data in data/campaigns.ts.

## Next Implementation Steps

1. Build Solidity crowdfunding contracts in ../hardhat and finalize events + storage layout.
2. Deploy contracts to local/dev network and export ABI + deployed address.
3. Add wallet integration in frontend (MetaMask connect/disconnect, chain checks).
4. Replace mock campaign data with on-chain reads.
5. Wire contribution and campaign creation actions to contract writes.
6. Add transaction UX states (pending, success, error) and explorer links.

## Environment Variables

Use an env file for frontend runtime configuration:

- .env.example (committed template)