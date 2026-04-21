import AboutSection from "../../components/AboutSection";
import TeamSection from "../../components/TeamSection";
import HowWeWorkSection from "../../components/HowWeWorkSection";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/30">
      <AboutSection />
      <TeamSection />
      <HowWeWorkSection />
    </main>
  );
}
