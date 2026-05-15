import dynamic from "next/dynamic";
import Hero from "../components/Hero";

const AboutSection = dynamic(() => import("../components/AboutSection"), { ssr: true });
const ProjectsSection = dynamic(() => import("../components/ProjectsSection"), { ssr: true });
const FeaturesAccordion = dynamic(() => import("../components/FeaturesAccordion"), { ssr: true });
const ComparisonSection = dynamic(() => import("../components/ComparisonSection"), { ssr: true });
const HomePricingSection = dynamic(() => import("../components/HomePricingSection"), { ssr: true });
const FAQSection = dynamic(() => import("../components/FAQSection"), { ssr: true });
const ContactSection = dynamic(() => import("../components/ContactSection"), { ssr: true });
const TestimonialsSection = dynamic(() => import("../components/TestimonialsSection"), { ssr: true });

export const revalidate = 3600;

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
