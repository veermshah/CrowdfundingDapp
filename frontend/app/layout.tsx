import type { Metadata } from "next";
import { DM_Sans, Sora } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChainFund | Transparent Crowdfunding",
  description:
    "A decentralized crowdfunding UI for trustless campaign creation, transparent donations, and on-chain milestone funding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${sora.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full font-sans text-slate-100">{children}</body>
    </html>
  );
}
