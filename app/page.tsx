import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import ProjectsSection from "../components/ProjectsSection";
import FeaturesAccordion from "../components/FeaturesAccordion";
import ComparisonSection from "../components/ComparisonSection";
import HomePricingSection from "../components/HomePricingSection";
import FAQSection from "../components/FAQSection";
import ContactSection from "../components/ContactSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/30">
      <Hero />
      <AboutSection />
      <ProjectsSection />
      <FeaturesAccordion />
      <ComparisonSection />
      <HomePricingSection />
      <FAQSection />
      <ContactSection />
    </main>
  );
}
