import { defineChain } from 'viem'

const DEFAULT_CROWDFUNDING_ADDRESS = '0xe0B93a16313F71B77A73de546557F6483e20B408'
const LEGACY_CROWDFUNDING_ADDRESS = '0xBCc7B75E058B25E7666315eAc27329B6c740e8ce' // This was the original address used during development, but it was used to deploy a different, older contract. We keep it here just in case we need to reference the old deployment for any reason.

const configuredCrowdfundingAddress = process.env.NEXT_PUBLIC_CROWDFUNDING_ADDRESS

export const CROWDFUNDING_ADDRESS = (
  configuredCrowdfundingAddress &&
  configuredCrowdfundingAddress !== '0x0000000000000000000000000000000000000000' &&
  configuredCrowdfundingAddress.toLowerCase() !== LEGACY_CROWDFUNDING_ADDRESS.toLowerCase()
    ? configuredCrowdfundingAddress
    : DEFAULT_CROWDFUNDING_ADDRESS
) as `0x${string}`

export const hardhatLocal = defineChain({
  id: 31337,
  name: 'Hardhat Local',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_RPC_URL ?? 'http://127.0.0.1:8545'] },
  },
})

export const CROWDFUNDING_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'creator', type: 'address' },
      { indexed: false, internalType: 'string', name: 'title', type: 'string' },
      { indexed: false, internalType: 'uint256', name: 'goalAmount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'deadline', type: 'uint256' },
    ],
    name: 'CampaignCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'campaignId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'contributor', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'Contributed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'campaignId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'creator', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'FundsWithdrawn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'campaignId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'contributor', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'Refunded',
    type: 'event',
  },
  {
    inputs: [],
    name: 'campaignCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'campaigns',
    outputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'address payable', name: 'creator', type: 'address' },
      { internalType: 'string', name: 'title', type: 'string' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'string', name: 'category', type: 'string' },
      { internalType: 'uint256', name: 'goalAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'uint256', name: 'raised', type: 'uint256' },
      { internalType: 'uint256', name: 'backerCount', type: 'uint256' },
      { internalType: 'bool', name: 'withdrawn', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'campaignId', type: 'uint256' }],
    name: 'contribute',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'address', name: '', type: 'address' },
    ],
    name: 'contributions',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: 'title', type: 'string' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'string', name: 'category', type: 'string' },
      { internalType: 'uint256', name: 'goalAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'durationSeconds', type: 'uint256' },
    ],
    name: 'createCampaign',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'getCampaign',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          { internalType: 'address payable', name: 'creator', type: 'address' },
          { internalType: 'string', name: 'title', type: 'string' },
          { internalType: 'string', name: 'description', type: 'string' },
          { internalType: 'string', name: 'category', type: 'string' },
          { internalType: 'uint256', name: 'goalAmount', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'uint256', name: 'raised', type: 'uint256' },
          { internalType: 'uint256', name: 'backerCount', type: 'uint256' },
          { internalType: 'bool', name: 'withdrawn', type: 'bool' },
        ],
        internalType: 'struct Crowdfunding.Campaign',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'campaignId', type: 'uint256' },
      { internalType: 'address', name: 'contributor', type: 'address' },
    ],
    name: 'getContribution',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'campaignId', type: 'uint256' }],
    name: 'refund',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'campaignId', type: 'uint256' }],
    name: 'withdrawFunds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
