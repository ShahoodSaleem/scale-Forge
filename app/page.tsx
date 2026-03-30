import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import ProjectsSection from "../components/ProjectsSection";
import FeaturesAccordion from "../components/FeaturesAccordion";
import ComparisonSection from "../components/ComparisonSection";
import PricingSection from "../components/PricingSection";
import FAQSection from "../components/FAQSection";
import ContactSection from "../components/ContactSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/30">
      <Navbar />
      <Hero />
      <AboutSection />
      <ProjectsSection />
      <FeaturesAccordion />
      <ComparisonSection />
      <PricingSection />
      <FAQSection />
      <ContactSection />
    </main>
  );
}
