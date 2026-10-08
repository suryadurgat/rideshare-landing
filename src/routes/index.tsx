import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { StatsBand } from "@/components/home/StatsBand";
import { TrustStrip } from "@/components/home/TrustStrip";
import { FairSeat } from "@/components/home/FairSeat";
import { Problem } from "@/components/home/Problem";
import { Why } from "@/components/home/Why";
import { Costs } from "@/components/home/Costs";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ProductStrip } from "@/components/home/ProductStrip";
import { AppTour } from "@/components/home/AppTour";
import { Safety } from "@/components/home/Safety";
import { Workplaces } from "@/components/home/Workplaces";
import { Dashboards } from "@/components/home/Dashboards";
import { Showcase } from "@/components/home/Showcase";
import { Reviews } from "@/components/home/Reviews";
import { Feedback } from "@/components/home/Feedback";
import { FAQ } from "@/components/home/FAQ";
import { ClosingCta } from "@/components/home/ClosingCta";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main>
      <Hero />
      <StatsBand />
      <TrustStrip />
      <Problem />
      <Why />
      <Costs />
      <HowItWorks />
      <ProductStrip />
      <AppTour />
      <Safety />
      <FairSeat />
      <Workplaces />
      <Dashboards />
      <Showcase />
      <Reviews />
      <Feedback />
      <FAQ />
      <ClosingCta />
    </main>
  );
}
