import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { CampaignGrid } from "../components/sections/CampaignGrid";
import { FinalCta } from "../components/sections/FinalCta";
import { HeroSection } from "../components/sections/HeroSection";
import { HowItWorks } from "../components/sections/HowItWorks";
import { LiveActivity } from "../components/sections/LiveActivity";
import { StatsStrip } from "../components/sections/StatsStrip";
import { TransparencyLedger } from "../components/sections/TransparencyLedger";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(1200px_600px_at_20%_-10%,#1f475f_0%,transparent_50%),radial-gradient(1000px_700px_at_90%_0%,#8e5a3a_0%,transparent_45%),linear-gradient(180deg,#0b1320_0%,#090f1a_50%,#0e1523_100%)]">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-6 pb-20 pt-8 sm:px-10 lg:px-14">
        <HeroSection />
        <StatsStrip />
        <CampaignGrid />
        <HowItWorks />
        <TransparencyLedger />
        <LiveActivity />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
