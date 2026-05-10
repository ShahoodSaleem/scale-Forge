import { Metadata } from "next";
import AboutSection from "../../components/AboutSection";
import TeamSection from "../../components/TeamSection";
import HowWeWorkSection from "../../components/HowWeWorkSection";
import PerfectShot from "../../components/PerfectShot";

export const metadata: Metadata = {
  title: "About Us | Scale Forge Web Agency",
  description:
    "Learn about Scale Forge. We are a team of expert web developers, designers, and SEO specialists dedicated to building high-converting digital products. Over 10 years of combined industry experience.",
  authors: [{ name: "Scale Forge Technical Team" }],
  publisher: "Scale Forge",
  openGraph: {
    title: "About Scale Forge | Expert Web Design & SEO",
    description: "Discover the experts behind Scale Forge. We combine cutting-edge tech with strategic marketing to scale your business.",
  },
};

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About Scale Forge",
  "description": "Information about Scale Forge, a premium web design and development agency.",
  "publisher": {
    "@id": "https://scaleforgewebdev.vercel.app/#organization"
  },
  "mainEntity": {
    "@type": "Organization",
    "name": "Scale Forge",
    "knowsAbout": ["Next.js", "Web Development", "UI/UX Design", "Technical SEO"]
  }
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <AboutSection />
      <TeamSection />
      <HowWeWorkSection />
      <PerfectShot />
    </main>
  );
}
