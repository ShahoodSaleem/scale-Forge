import FeaturesAccordion from "../../components/FeaturesAccordion";
import ComparisonSection from "../../components/ComparisonSection";

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/30">
      <FeaturesAccordion />
      <ComparisonSection />
    </main>
  );
}
