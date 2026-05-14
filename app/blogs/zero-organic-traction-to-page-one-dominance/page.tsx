"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import ContactSection from "../../../components/ContactSection";

export default function ArticlePage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const isLight = mounted && resolvedTheme === "light";

  const article = {
    title: "How a Regional Real Estate Firm Tripled Qualified Lead Volume in 9 Months",
    category: "Case Study",
    date: "April 2026",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1596&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    summary: "A mid-size residential real estate brokerage was haemorrhaging marketing budget on paid search with no sustainable SEO strategy in place. Organic search accounted for less than 8% of total website traffic, leaving the business entirely dependent on paid advertising for lead generation. Scale Forge deployed a full-funnel SEO campaign — encompassing technical SEO, local search optimisation, high-intent keyword targeting, conversion rate optimisation, and authoritative link building — that delivered a 300% increase in organic lead conversions within nine months, dramatically reduced cost-per-acquisition, and built a compounding digital asset that continues to drive revenue growth long after the initial engagement.",
  };

  const pageRef = useRef<HTMLDivElement>(null);
  const pMouseX = useMotionValue(-1000);
  const pMouseY = useMotionValue(-1000);

  const pSpringX = useSpring(pMouseX, { stiffness: 150, damping: 40 });
  const pSpringY = useSpring(pMouseY, { stiffness: 150, damping: 40 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      pMouseX.set(e.clientX);
      pMouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [pMouseX, pMouseY]);

  return (
    <main ref={pageRef} className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-blue-500/20 dark:selection:bg-orange-500/30 relative overflow-hidden">
      <GlareBlob pSpringX={pSpringX} pSpringY={pSpringY} />
      <style>{`
        .blob-card {
          position: relative;
          z-index: 20;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .blob-bg {
          position: absolute;
          top: 2px;
          left: 2px;
          right: 2px;
          bottom: 2px;
          z-index: 2;
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(24px);
          border-radius: 14px;
        }

        :is(.dark) .blob-bg {
          background: rgba(10, 10, 10, 0.9);
        }

        .blob-element {
          position: absolute;
          z-index: 1;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background-color: #3b82f6;
          opacity: 0.8;
          filter: blur(40px);
          pointer-events: none;
        }

        :is(.dark) .blob-element {
          background-color: #ea580c;
        }
      `}</style>

      {/* 1. TITLE SECTION */}
      <section className="relative pt-32 pb-16 md:pt-36 md:pb-20 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/5 text-orange-500 text-[10px] font-bold uppercase tracking-widest mb-8">
              {article.category}
            </div>

            <h1 className="text-4xl md:text-7xl font-medium tracking-tight mb-8 leading-tight text-black dark:text-white">
              {article.title}
            </h1>

            <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40 mb-6">
              <span>{article.date}</span>
              <div className="w-1 h-1 rounded-full bg-orange-500" />
              <span>5 Min Read</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. PICTURE SECTION */}
      <section className="w-full max-w-6xl mx-auto px-6 relative z-20 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full h-[400px] md:h-[600px] rounded-xl overflow-hidden border border-white/10 shadow-2xl relative"
        >
          <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </motion.div>
      </section>

      <section className="py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-none lg:text-xl mx-auto leading-relaxed font-light space-y-12 relative z-20">

            {/* 3. EXECUTIVE SUMMARY SECTION */}
            <div className="border-b border-black/10 dark:border-white/10 pb-16 mb-16">
              <h3 className="text-black dark:text-white font-medium text-2xl mb-6 flex items-center gap-4">
                Executive Summary
                <div className="flex-1 h-[1px] bg-black/10 dark:bg-white/10" />
              </h3>
              <p
                className="text-xl leading-relaxed italic border-l-2 pl-6 py-2"
                style={{
                  color: isLight ? '#2563eb' : 'rgba(255, 237, 213, 0.7)',
                  borderColor: isLight ? '#60a5fa' : 'rgba(249, 115, 22, 0.5)',
                }}
              >
                {article.summary}
              </p>
            </div>

            {/* 4. BODY PARAGRAPHS */}
            <div className="space-y-8">
              <p className="text-lg md:text-xl !text-black dark:!text-white/70">
                The brokerage had been operating in a competitive metro property market for several years and had a well-presented website, experienced agents, and a solid track record of closed deals. What they did not have was any meaningful organic search presence. When we pulled the initial data, the site was sitting on page four or worse for virtually every keyword that mattered to their business. Transactional queries like "homes for sale in California," "top real estate agents near me," and "sell my house fast Spring Valley" were all being dominated by competitors. The client had responded to this by increasing Google Ads spend and running paid social campaigns, but with cost-per-click rates on real estate keywords pushing higher each quarter, that approach was eating into margins without solving the underlying problem. The technical picture was equally poor. A full site audit uncovered duplicate title tags and meta descriptions across hundreds of property listing pages, no structured data or schema markup of any kind, crawl errors blocking key sections of the site, and Core Web Vitals scores that were well below the thresholds Google uses as ranking signals. The Google Business Profile had never been properly set up, local citations were inconsistent or missing, and the blog had not been updated in over fourteen months. None of this was a surprise. It is a pattern we see regularly with real estate businesses that have grown through referrals and word of mouth and never had to think seriously about search until paid acquisition costs force the issue.
              </p>

              <p className="text-lg md:text-xl !text-black dark:!text-white/70">
                Before writing a single piece of content or building a single link, we spent the first few weeks getting the technical foundations right. There is no point investing in content or outreach when the site has crawlability issues, slow page load times on mobile, and duplicate signals confusing Google about which pages to rank. We resolved all critical technical issues, implemented RealEstateListing and LocalBusiness schema markup, consolidated duplicate pages, fixed the URL structure across listing categories, and brought Core Web Vitals scores into the green across both desktop and mobile. In parallel, we completed a full keyword research project to map out the complete demand landscape for the client's service area. This was not a surface-level exercise. We looked at search volume, keyword difficulty, and commercial intent across every stage of the buyer and seller journey, from early-stage informational queries from first-time buyers all the way down to high-conversion, bottom-funnel terms from motivated sellers. From that keyword map we restructured the site's architecture entirely, creating dedicated location and service pages optimised specifically for local organic search and Google Maps rankings. A content programme was then built around the mid-funnel gap that almost every real estate site ignores. Most competitors had their service pages and their blog, but nothing in between. We developed long-form content that addressed specific buyer and seller concerns in the local market, written to satisfy Google's E-E-A-T signals and structured to capture featured snippet positions and People Also Ask visibility. Link acquisition ran alongside content from month three onwards. We focused on relevant, editorially placed links from regional news outlets, property industry publications, and local community websites rather than volume-based outreach. Every link was evaluated on topical relevance and domain authority before we pursued it. Google Business Profile was fully optimised and a structured review acquisition process was put in place within the first sixty days to accelerate local pack rankings independently of the broader organic campaign.
              </p>

              <p className="text-lg md:text-xl !text-black dark:!text-white/70">
                The nine-month engagement ran across three phases. The first two months were technical only. No content was published, no outreach was run. Getting a site's foundations wrong and then building on top of them is one of the most common and expensive mistakes in SEO, so we gave this phase the time it required. By the end of month two, all technical issues had been resolved, schema was in place, the site architecture had been rebuilt around the new keyword map, and local SEO groundwork including citation building and Google Business Profile setup was complete. Months three through six moved into content production and link acquisition. We published two to three substantive articles per month, each targeting specific keyword clusters identified in the research phase and built to provide genuine value to buyers and sellers in the local market. On-page optimisation was applied to all existing commercial pages as part of the same phase. The first ranking movements became visible at the end of month three, which is typical for a site that has had significant technical work done. By month five the organic traffic trend was clearly and consistently upward. The final phase, months seven through nine, was focused almost entirely on conversion. Increased organic traffic is meaningless if the site cannot convert visitors into enquiries, so we ran a structured CRO programme covering landing page layouts, form placement and design, calls to action, and the overall user journey from search click to lead submission. By month nine the client had a site that was performing well in search, converting at a significantly higher rate, and generating a level of inbound lead volume that had made their Google Ads dependency essentially optional rather than necessary.
              </p>
            </div>

            {/* 5. RESULTS SECTION */}
            <ResultsCard />



          </div>
        </div>
      </section>

      <ContactSection />
    </main>
  );
}

const ResultsCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springX = useSpring(mouseX, { stiffness: 150, damping: 40 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 40 });

  useEffect(() => {
    if (window.innerWidth <= 768) {
      mouseX.set(200);
      mouseY.set(200);
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || window.innerWidth <= 768) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div ref={cardRef} className="my-16 p-10 blob-card border border-blue-200 dark:border-orange-500/20 rounded-2xl group">
      <div className="blob-bg"></div>
      <motion.div
        className="blob-element transition-opacity duration-1000 opacity-20 group-hover:opacity-60"
        style={{
          x: springX,
          y: springY,
          top: 0,
          left: 0,
          marginLeft: "-150px",
          marginTop: "-150px"
        }}
      />

      <div className="relative z-10">
        <h3 className="text-blue-600 dark:text-orange-500 font-bold uppercase tracking-[0.2em] text-xs mb-8 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-orange-500 animate-pulse" />
          Results & Impact
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="border-l border-black/10 dark:border-white/10 pl-6">
            <div className="text-5xl font-medium text-black dark:text-white mb-2 leading-none">+300%</div>
            <div className="text-black/40 dark:text-white/40 text-[10px] font-bold uppercase tracking-widest">Clicks On Website</div>
          </div>
          <div className="border-l border-black/10 dark:border-white/10 pl-6">
            <div className="text-5xl font-medium text-black dark:text-white mb-2 leading-none">4x</div>
            <div className="text-black/40 dark:text-white/40 text-[10px] font-bold uppercase tracking-widest">Leads Generated</div>
          </div>
        </div>

        <p className="text-black/70 dark:text-white/80 leading-relaxed border-t border-black/10 dark:border-white/10 pt-6 mt-6">
          This breakdown shows the immediate impact of the deliverables upon launch, securing long-term growth and stability for the client's web presence.
        </p>
      </div>
    </div>
  );
};

const GlareBlob = ({ pSpringX, pSpringY }: { pSpringX: any; pSpringY: any }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Don't render until mounted so we know the real theme
  if (!mounted) return null;

  const isLight = resolvedTheme === "light";
  return (
    <motion.div
      className="fixed pointer-events-none z-10 opacity-40 blur-[120px]"
      style={{
        x: pSpringX,
        y: pSpringY,
        left: 0,
        top: 0,
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        backgroundColor: isLight ? "rgba(59,130,246,0.5)" : "#ea5a0c81",
        marginLeft: "-200px",
        marginTop: "-200px",
      }}
    />
  );
};
