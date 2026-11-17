import { CtaSection } from "@/components/home/cta-section";
import { EngineStrip } from "@/components/home/engine-strip";
import { FaqSection } from "@/components/home/faq-section";
import { FeaturesSection } from "@/components/home/features-section";
import { HeroSection } from "@/components/home/hero-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { ShowcaseSection } from "@/components/home/showcase-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <EngineStrip />
      <FeaturesSection />
      <ShowcaseSection />
      <HowItWorksSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
