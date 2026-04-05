"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ContactSection from "../../../components/ContactSection";

export default function ArticlePage() {
  const article = {
    title: "How a Regional Real Estate Firm Tripled Qualified Lead Volume in 9 Months",
    category: "Case Study",
    date: "April 2026",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1596&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    summary: "A mid-size residential real estate brokerage was haemorrhaging marketing budget on paid search with no sustainable SEO strategy in place. Organic search accounted for less than 8% of total website traffic, leaving the business entirely dependent on paid advertising for lead generation. Scale Forge deployed a full-funnel SEO campaign — encompassing technical SEO, local search optimisation, high-intent keyword targeting, conversion rate optimisation, and authoritative link building — that delivered a 300% increase in organic lead conversions within nine months, dramatically reduced cost-per-acquisition, and built a compounding digital asset that continues to drive revenue growth long after the initial engagement.",
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-orange-500/30">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-24 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="text-white text-xl font-bold tracking-widest uppercase">
          Scale Forge
        </div>
        <Link
          href="/blogs"
          className="flex items-center gap-2 text-white/60 hover:text-orange-500 transition-colors uppercase tracking-[0.2em] text-[10px] font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-orange-500/50"
        >
          <ArrowLeft size={16} />
          <span>Back to Blogs</span>
        </Link>
      </nav>

      {/* 1. TITLE SECTION */}
      <section className="relative pt-40 pb-16 md:pt-48 md:pb-20 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/5 text-orange-500 text-[10px] font-bold uppercase tracking-widest mb-8">
              {article.category}
            </div>

            <h1 className="text-4xl md:text-7xl font-medium tracking-tight mb-8 leading-tight">
              {article.title}
            </h1>

            <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-wider text-white/40 mb-6">
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
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </section>

      <section className="py-12 bg-black relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="prose prose-invert prose-orange max-w-none lg:prose-xl mx-auto text-white/70 leading-relaxed font-light space-y-12">

            {/* 3. BODY PARAGRAPHS */}
            <div className="space-y-8">
              <p className="text-lg md:text-xl">
                When this real estate client first engaged Scale Forge, their core problem was straightforward but costly: their website had virtually no organic search visibility despite operating in a high-demand local property market. The firm was buried on page four and beyond for every high-intent, buyer-ready keyword in their niche — from hyper-local searches like "homes for sale in California" to transactional queries such as "best real estate agent near me" and "sell my house fast." With no SEO content strategy, no credible backlink profile, and a Google Business Profile that was incomplete and unverified, the website was failing to generate meaningful organic traffic or inbound leads. To compensate, the client had escalated spending on Google Ads and paid social campaigns, but rising cost-per-click rates across competitive real estate keywords were compressing margins and making paid acquisition unsustainable as a long-term growth channel. A deeper technical SEO audit revealed compounding on-site issues: duplicate meta titles and descriptions across property listing pages, missing structured data and schema markup, unoptimised URL structures, and mobile Core Web Vitals scores that were actively triggering ranking suppression in Google's algorithm. The business had strong agents, a quality service offering, and genuine local market expertise — but none of that was being communicated to search engines, nor surfaced to prospective buyers and sellers actively searching online.
              </p>

              <p className="text-lg md:text-xl">
                Scale Forge approached this engagement with a data-driven SEO strategy built around three priorities: technical authority, content relevance, and local search dominance. The process began with a comprehensive SEO audit covering over 60 on-site ranking factors, identifying the critical issues suppressing organic rankings, website traffic, and lead generation performance. Simultaneously, our team conducted in-depth keyword research to map the full search landscape — identifying high-volume, high-conversion keywords across all buyer intent stages, from informational queries targeting first-time homebuyers to bottom-funnel searches from motivated sellers ready to convert. From this keyword architecture, Scale Forge restructured the site's information hierarchy, building out geo-targeted landing pages optimised for local SEO signals, neighbourhood-level search terms, and Google Maps ranking factors. A content marketing programme was launched producing two to three long-form, E-E-A-T-aligned authority articles per month — targeting mid-funnel organic search traffic and positioning the brand as a trusted, authoritative resource in the local real estate market. An outreach-led link building campaign secured high-domain-authority placements across regional publications, real estate directories, and community platforms, significantly strengthening the site's backlink profile and domain rating. Google Business Profile optimisation, local citation building across key directories, and a structured review acquisition strategy were all completed within the first 60 days to accelerate map-pack rankings and capture high-intent local organic search traffic.
              </p>

              <p className="text-lg md:text-xl">
                Scale Forge structured the engagement across three distinct phases, each designed to build on the last and compound SEO performance over time. Phase one — technical SEO and foundational optimisation (months one and two) — focused on resolving all critical crawl errors, implementing property listing schema markup, improving page speed and Core Web Vitals scores to meet Google's ranking thresholds, and completing all local SEO groundwork including citation building and Google Business Profile verification. Phase two — content marketing, on-page SEO, and link acquisition (months three through six) — shifted focus to sustained organic search growth through keyword-targeted content production, on-page optimisation of all core commercial landing pages, and an active digital PR and link building campaign targeting authoritative, niche-relevant referring domains. Measurable keyword ranking improvements began appearing at the close of month three, with consistent upward momentum in organic traffic and search engine visibility throughout months four and five. Phase three — conversion rate optimisation and revenue acceleration (months seven through nine) — concentrated on converting increased organic search traffic into qualified leads and measurable business revenue. This included A/B testing of landing page layouts, optimisation of lead capture forms and calls-to-action across high-traffic pages, and refinement of the full user journey from search result click to enquiry submission. By the end of the nine-month engagement, the client possessed a high-performing, self-sustaining SEO infrastructure — a genuine long-term digital asset generating consistent inbound leads and a compounding return on investment, entirely independent of paid advertising spend.
              </p>
            </div>

            {/* 4. RESULTS SECTION */}
            <div className="my-16 p-10 relative overflow-hidden bg-[#0a0a0a] border border-orange-500/20 rounded-2xl">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

              <h3 className="text-orange-500 font-bold uppercase tracking-[0.2em] text-xs mb-8 relative z-10 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                Results & Impact
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative z-10">
                <div className="border-l border-white/10 pl-6">
                  <div className="text-5xl font-medium text-white mb-2 leading-none">+300%</div>
                  <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Clicks On Website</div>
                </div>
                <div className="border-l border-white/10 pl-6">
                  <div className="text-5xl font-medium text-white mb-2 leading-none">4x</div>
                  <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Leads Generated</div>
                </div>
              </div>

              <p className="text-white/80 relative z-10 leading-relaxed border-t border-white/10 pt-6 mt-6">
                This breakdown shows the immediate impact of the deliverables upon launch, securing long-term growth and stability for the client's web presence.
              </p>
            </div>

            {/* 5. EXECUTIVE SUMMARY SECTION */}
            <div className="border-t border-white/10 pt-16 mt-16 pb-16">
              <h3 className="text-white/80 font-medium text-2xl mb-6 flex items-center gap-4">
                Executive Summary
                <div className="flex-1 h-[1px] bg-white/10" />
              </h3>
              <p className="text-orange-100/70 text-xl leading-relaxed italic border-l-2 border-orange-500/50 pl-6 py-2">
                {article.summary}
              </p>
            </div>

          </div>
        </div>
      </section>

      <ContactSection />
    </main>
  );
}
