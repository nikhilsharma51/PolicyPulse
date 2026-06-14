import Navbar from "@/components/Navbar";
import Hero from "@/components/landing/Hero";
import ProblemSection from "@/components/landing/ProblemSection";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import HowItWorks from "@/components/landing/HowItWorks";

import WhyPolicyPulse from "@/components/landing/WhyPolicyPulse";
import ArchitectureSection from "@/components/landing/ArchitectureSection";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <ProblemSection />
        <FeaturesGrid />
        <HowItWorks />
        <WhyPolicyPulse />
        <ArchitectureSection />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
