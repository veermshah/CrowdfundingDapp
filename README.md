# ChainFunded

Decentralized crowdfunding dapp with a Next.js frontend and a Solidity smart contract built with Hardhat.

Live demo: https://chainfunded.vercel.app/

This would be the easiest place to test our code since all the contracts are already deployed and the frontend is configured to point to the correct Sepolia addresses. You can create campaigns, contribute, and withdraw funds directly from the live app.

If you would still like to run the code locally, you can follow the setup instructions below. The local setup will allow you to test against a local Hardhat network or the Sepolia testnet, depending on your configuration.

## Source Code

This repository contains the complete, functional source code for both the frontend and the smart contracts:

- frontend: Next.js app (UI and web client)
- hardhat: Solidity contracts, tests, and deployment modules

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Hardhat 3 + viem
- Solidity 0.8.28

## Deployed Contract

- Network: Sepolia
- Contract: Crowdfunding
- Address: 0xe0B93a16313F71B77A73de546557F6483e20B408

## Dependencies

- Node.js 18+ and npm

All JavaScript dependencies are declared in:

- frontend/package.json
- hardhat/package.json

## Setup

1. Install frontend dependencies:

```bash
cd frontend
npm install
```

2. Install Hardhat dependencies:

```bash
cd ../hardhat
npm install
```

3. Configure frontend environment variables:

```bash
cd ../frontend
copy .env.example .env.local
```

Update values in .env.local:

NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/4ddd061ad6974f229f105f7bf3abce6c
NEXT_PUBLIC_CROWDFUNDING_ADDRESS=0xe0B93a16313F71B77A73de546557F6483e20B408

4. Optional: configure Sepolia deployment variables for Hardhat:

- SEPOLIA_RPC_URL
- SEPOLIA_PRIVATE_KEY

## Local Testing

### Frontend (dev)

```bash
cd frontend
npm run dev
```

Open http://localhost:3000

### Smart Contract Tests

```bash
cd hardhat
npx hardhat test
```

## Deployments

### Local deployment

```bash
cd hardhat
npx hardhat ignition deploy ignition/modules/CrowdfundingV2.ts
```

### Sepolia deployment

```bash
cd hardhat
npx hardhat ignition deploy --network sepolia ignition/modules/CrowdfundingV2.ts
```

## Notes

- The frontend can run against local or Sepolia RPC endpoints depending on your .env.local settings.
- If PowerShell blocks npm.ps1 on Windows, run commands via cmd.exe or allow scripts for the current user.
