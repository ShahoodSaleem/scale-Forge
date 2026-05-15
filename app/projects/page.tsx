import ProjectsSection from "../../components/ProjectsSection";

export const revalidate = 3600;

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/30">
      <ProjectsSection />
    </main>
  );
}
