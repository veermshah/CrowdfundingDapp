export type Campaign = {
  id: string;
  title: string;
  creator: string;
  category: string;
  summary: string;
  raisedEth: number;
  goalEth: number;
  daysLeft: number;
  backers: number;
  verified: boolean;
  theme: string;
};

export type LiveContribution = {
  contributor: string;
  campaign: string;
  amountEth: number;
  txHash: string;
  secondsAgo: number;
};