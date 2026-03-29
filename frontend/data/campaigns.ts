import type { Campaign, LiveContribution } from "../types/campaign";

export const featuredCampaigns: Campaign[] = [
  {
    id: "cf-001",
    title: "Solar Rooftops For Community Schools",
    creator: "GreenGrid Kenya",
    category: "Climate",
    summary:
      "Equip 12 public schools with solar systems and transparent milestone-based contractor payments.",
    raisedEth: 118.4,
    goalEth: 160,
    daysLeft: 19,
    backers: 842,
    verified: true,
    theme: "from-cyan-500/40 to-teal-400/10",
  },
  {
    id: "cf-002",
    title: "On-Chain Rural Telemedicine Clinics",
    creator: "PulseRelief DAO",
    category: "Health",
    summary:
      "Build 4 telemedicine hubs and release funds only when infrastructure audits are posted on-chain.",
    raisedEth: 76.2,
    goalEth: 90,
    daysLeft: 8,
    backers: 515,
    verified: true,
    theme: "from-emerald-500/40 to-lime-400/10",
  },
  {
    id: "cf-003",
    title: "Open Hardware Water Monitoring Kits",
    creator: "Aqua Commons",
    category: "Public Goods",
    summary:
      "Ship low-cost sensors to 60 villages and publish all procurement transfers in public dashboards.",
    raisedEth: 42.5,
    goalEth: 110,
    daysLeft: 31,
    backers: 298,
    verified: false,
    theme: "from-amber-500/35 to-orange-300/10",
  },
  {
    id: "cf-004",
    title: "Scholarship Pool For Web3 Security Training",
    creator: "ByteShield Foundation",
    category: "Education",
    summary:
      "Fund 200 students and unlock scholarship tranches after completion and mentor verification.",
    raisedEth: 59.9,
    goalEth: 75,
    daysLeft: 14,
    backers: 403,
    verified: true,
    theme: "from-sky-500/35 to-indigo-400/10",
  },
];

export const liveContributions: LiveContribution[] = [
  {
    contributor: "0x7A3F...2d11",
    campaign: "On-Chain Rural Telemedicine Clinics",
    amountEth: 0.65,
    txHash: "0x0e3c98...af91",
    secondsAgo: 27,
  },
  {
    contributor: "0xB17C...71af",
    campaign: "Solar Rooftops For Community Schools",
    amountEth: 1.2,
    txHash: "0x8f77de...c4e2",
    secondsAgo: 66,
  },
  {
    contributor: "0x91d2...0Fe4",
    campaign: "Scholarship Pool For Web3 Security Training",
    amountEth: 0.33,
    txHash: "0xa6bd2f...1921",
    secondsAgo: 111,
  },
  {
    contributor: "0x2f38...Ae20",
    campaign: "Open Hardware Water Monitoring Kits",
    amountEth: 0.88,
    txHash: "0x9ee116...78ac",
    secondsAgo: 182,
  },
];

export const platformStats = [
  { label: "ETH Raised", value: "1,842.6" },
  { label: "Verified Campaigns", value: "124" },
  { label: "Active Contributors", value: "18,490" },
  { label: "On-Chain Transactions", value: "96K+" },
];