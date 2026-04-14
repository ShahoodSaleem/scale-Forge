import AboutSection from "../../components/AboutSection";
import TeamSection from "../../components/TeamSection";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/30">
      <AboutSection />
      <TeamSection />
    </main>
  );
}
