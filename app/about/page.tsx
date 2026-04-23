import AboutSection from "../../components/AboutSection";
import TeamSection from "../../components/TeamSection";
import HowWeWorkSection from "../../components/HowWeWorkSection";
import PerfectShot from "../../components/PerfectShot";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/30">
      <AboutSection />
      <TeamSection />
      <HowWeWorkSection />
      <PerfectShot />
    </main>
  );
}
