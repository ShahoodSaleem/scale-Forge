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
    title: "How the Right SEO Agency Can Transform Your Business in 2026",
    category: "Blog",
    date: "May 2026",
    image: "https://images.unsplash.com/photo-1674027326254-88c960d8e561?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    summary: "This guide explains how partnering with a results driven SEO agency USA can accelerate business growth in 2026 by improving Google rankings, increasing organic traffic, and generating high quality leads. With AI powered search, zero click results, and rising competition, businesses need advanced SEO strategies including keyword research, technical SEO, on page optimization, content marketing, and link building to stay visible. Scale Forge delivers data driven SEO services designed to boost search engine rankings, enhance website performance, and drive measurable ROI, making SEO a critical long term investment for companies aiming to dominate their niche online.",
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
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background-color: #28559dff;
          opacity: 0.8;
          filter: blur(30px);
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
            sizes="(max-width: 1200px) 100vw, 1152px"
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

            {/* {Subheadings 1} */}
            <div className="space-y-8">
              <h2 className="font-medium md:text-4xl !text-black dark:!text-white">What Does A SEO Agency Actually Do for Your Business?</h2>

            </div>

            {/* 4. BODY PARAGRAPHS */}
            <div className="space-y-8">
              <p className="text-lg md:text-xl !text-black dark:!text-white/70">
                If you’ve been running a business in the US and wondering why your competitors keep showing up on Google while you don’t, the answer is almost always SEO. Search Engine Optimization is the process of making your website more visible on Google and other search engines so that the right people find you at the right time.

                <br />
                <br />

                A professional SEO agency doesn’t just stuff keywords into your pages. The best agencies take a data-driven, strategic approach that covers everything from technical audits to content creation to link building,all working together to push your website higher in search rankings.

                <br />
                <br />

                At Scale Forge, we specialize in results-driven SEO that’s built around your business goals. Whether you’re a startup looking to get your first 1,000 visitors or an established brand trying to dominate your niche, our SEO strategies are designed to deliver measurable growth.
              </p>

              {/* {subheading 2} */}
              <h1 className="font-medium md:text-4xl !text-black dark:!text-white">Why SEO Matters More Than Ever in 2026</h1>

              {/* {body paragraph 2} */}
              <p className="text-lg md:text-xl !text-black dark:!text-white/70">
                The digital landscape has changed dramatically. With AI-powered search results, zero-click searches, and Google’s ever-evolving algorithm, businesses that don’t invest in SEO are falling behind fast.

                <br />
                <br />
                <h3 className="font-medium md:text-xl !text-black dark:!text-white">Here's why SEO is non-negotiable in 2026:</h3>
                1. 60%+ of all searches are zero-click, meaning Google shows the answer directly. If your site isn’t optimized for featured snippets and AI Overviews, you’re invisible.
                <br />
                <br />
                2.	Organic search drives 53% of all website traffic meaning more than any other channel including paid ads and social media.
                <br />
                <br />
                3.	Google processes 8.5 billion searches per day and your potential customers are among them right now.
                <br />
                <br />
                4. Businesses that rank on page 1 get 95% of all clicks page 2 is essentially a graveyard.
                <br />
                <br />
                5. Search Traffic is Intent-Driven
                Unlike paid ads where you pay for every impression, organic search traffic comes from people actively looking for what you offer. This intent-driven traffic converts at much higher rates than traffic from other channels.
                <br />
                <br />
                The question isn’t whether you need SEO. The question is whether you’re doing it right.

              </p>
              {/* {subheading 3} */}
              <h1 className="font-medium md:text-4xl !text-black dark:!text-white">What Scale Forge’s SEO Service Includes</h1>

              {/* {body paragraph 3} */}
              <p className="text-lg md:text-xl !text-black dark:!text-white/70">
                Our SEO service is comprehensive, transparent, and built for long-term growth. Here’s what you get:
              </p>


              1. In-Depth Keyword Research: We identify the exact terms your target customers are searching for, including high volume keywords, long tail opportunities, and competitor gaps. Every strategy starts with data, not guesswork.

              <br />
              <br />

              2. On-Page SEO Optimization: We optimize your meta titles, descriptions, headings, internal links, image alt tags, and content structure so Google understands exactly what each page is about.

              <br />
              <br />

              3. Technical SEO Audit: We fix the behind the scenes issues that hurt your rankings, slow load times, broken links, crawl errors, duplicate content, and poor mobile experience.

              <br />
              <br />

              4. Content Strategy & Creation: We create SEO-optimized blog posts, landing pages, and service pages that rank for your target keywords and convert visitors into customers.

              <br />
              <br />

              5. Link Building: We build high-quality backlinks from authoritative websites in your industry, one of the strongest ranking signals Google uses.

              <br />
              <br />

              6. Monthly Reporting: You get clear, easy to understand, reports showing your keyword rankings, traffic growth, and ROI every single month.


              <br />
              <br />



              {/* {subheading 4} */}
              <h1 className="font-medium md:text-4xl !text-black dark:!text-white">Real Results: What SEO Can Do for Your Business</h1>

              {/* {body paragraph 4} */}
              <p className="text-lg md:text-xl !text-black dark:!text-white/70">
                Our clients have seen remarkable results from our SEO strategies:

                <br />
                <br />
                •	A dental clinic we worked with went from zero online presence to ranking on page 1 for 12 local keywords within 4 months.

                <br />
                <br />
                •	An e-commerce store we optimized saw a 200% increase in organic traffic in just 3 months.

                <br />
                <br />
                •	A service business we helped now gets 80% of its new leads from Google, completely organically.


                <br />
                <br />

                These aren’t flukes. They’re the result of a proven, systematic approach to SEO.

              </p>

              {/* {subheading 5} */}
              <h1 className="font-medium md:text-4xl !text-black dark:!text-white">Ready to Rank Higher on Google?</h1>

              {/* {body paragraph 5} */}
              <p className="text-lg md:text-xl !text-black dark:!text-white/70">
                If you’re serious about growing your business online, SEO is the most powerful long-term investment you can make. Scale Forge is ready to build a custom SEO strategy that gets your website in front of the right people at the right time.

                <br />
                <br />
                📩 Contact us: <span onClick={() => window.location.href = `mailto:${'scaleforge.sales'}@${'gmail.com'}`} className="cursor-pointer hover:text-orange-500 transition-colors">{'scaleforge.sales'}@{'gmail.com'}</span>
                <br />
                <br />
                📞 Book a free call at scaleforgewebdev.vercel.app
                <br />
                <br />
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
            <div className="text-5xl font-medium text-black dark:text-white mb-2 leading-none">+200%</div>
            <div className="text-black/40 dark:text-white/40 text-[10px] font-bold uppercase tracking-widest">Increase In Traffic within first Quarter</div>
          </div>
          <div className="border-l border-black/10 dark:border-white/10 pl-6">
            <div className="text-5xl font-medium text-black dark:text-white mb-2 leading-none">No.1</div>
            <div className="text-black/40 dark:text-white/40 text-[10px] font-bold uppercase tracking-widest">Position for 12 Keywords within 4 Months</div>
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
      className="fixed pointer-events-none z-10 opacity-0 blur-[120px]"
      style={{
        x: pSpringX,
        y: pSpringY,
        left: 0,
        top: 0,
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        backgroundColor: isLight ? "rgba(59, 199, 246, 0.5)" : "#ea5a0c81",
        marginLeft: "-200px",
        marginTop: "-200px",
      }}
    />
  );
};
