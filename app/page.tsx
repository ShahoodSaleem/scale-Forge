import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import ProjectsSection from "../components/ProjectsSection";
import FeaturesAccordion from "../components/FeaturesAccordion";
import ComparisonSection from "../components/ComparisonSection";
import HomePricingSection from "../components/HomePricingSection";
import FAQSection from "../components/FAQSection";
import ContactSection from "../components/ContactSection";
import TestimonialsSection from "../components/TestimonialsSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/30">
      <Hero />
      <AboutSection />
      <ProjectsSection />
      <FeaturesAccordion />
      <ComparisonSection />
      <HomePricingSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
    </main>
  );
}
