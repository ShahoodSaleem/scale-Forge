import FeaturesAccordion from "../../components/FeaturesAccordion";
import ExplainFeatures from "../../components/ExplainFeatures";

// import ComparisonSection from "../../components/ComparisonSection";

export const revalidate = 3600;

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/30">
      <FeaturesAccordion />
      <ExplainFeatures />
    </main>
  );
}
