"use client";

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Check } from 'lucide-react';
import PremiumButton from './PremiumButton';
import { useEffect, useRef } from 'react';
import styles from './HomePricingSection.module.css';

const PricingCard = ({ plan, planIdx }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const rectRef = useRef<DOMRect | null>(null);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    // Only run mouse tracking on desktop
    if (window.innerWidth <= 768) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      if (!rectRef.current) {
        rectRef.current = cardRef.current.getBoundingClientRect();
      }
      const x = e.clientX - rectRef.current.left;
      const y = e.clientY - rectRef.current.top;
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseEnter = () => {
      if (cardRef.current) {
        rectRef.current = cardRef.current.getBoundingClientRect();
      }
    };

    const node = cardRef.current;
    if (node) {
      node.addEventListener("mouseenter", handleMouseEnter);
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (node) {
        node.removeEventListener("mouseenter", handleMouseEnter);
      }
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={cardRef as any}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: planIdx * 0.1 }}
      className={`${styles.blobCard} group min-h-[500px] transition-all duration-500 bg-black ${
        plan.popular 
          ? '!border-transparent relative z-20 md:-translate-y-2' 
          : 'hover:!border-white/10'
      }`}
    >
      {/* Outer static glow for popular card */}
      {plan.popular && (
        <div className="absolute inset-0 rounded-[20px] shadow-[0_0_50px_color-mix(in_srgb,var(--color-orange-600)_15%,transparent)] pointer-events-none z-0" />
      )}

      {/* Premium Masked Moving Border */}
      {plan.popular && (
        <div 
          className="absolute inset-0 z-20 pointer-events-none rounded-[20px] p-[2px] overflow-hidden"
          style={{
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude"
          }}
        >
          <div 
            className="absolute inset-[-100%] animate-[spin_4s_linear_infinite]"
            style={{
              background: "conic-gradient(from 0deg, transparent 40%, color-mix(in srgb, var(--color-orange-600) 10%, transparent) 60%, color-mix(in srgb, var(--color-orange-600) 80%, transparent) 90%, var(--color-orange-400) 100%)"
            }}
          />
        </div>
      )}
      <div className={`${styles.blobBg} bg-black/85`}></div>
      <motion.div
        className={`${styles.blobElement} transition-opacity duration-1000 opacity-30 md:opacity-20 group-hover:opacity-80`}
        style={{
          x: springX,
          y: springY,
          top: 0,
          left: 0,
          marginLeft: "-125px",
          marginTop: "-125px"
        }}
      />

      <div className="relative z-10 flex flex-col p-8 h-full pointer-events-auto">
        <div className="flex justify-between items-start mb-4">
          <div className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase">{plan.tier}</div>
          {plan.popular && (
            <span className="bg-orange-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">Most Popular</span>
          )}
        </div>
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-4xl font-bold text-white">
            ${plan.price}
          </span>
          <span className="text-white/30 text-xs">{plan.period}</span>
        </div>

        <p className="text-white/50 text-sm mb-4 italic min-h-[48px]">
          {plan.description}
        </p>

        {plan.bestFor && (
          <div className="mb-6 text-sm">
            <span className="font-bold text-orange-500">Best For: </span>
            <span className="text-white/60">{plan.bestFor}</span>
          </div>
        )}

        <ul className="space-y-3 mb-8 flex-grow">
          {plan.features.map((feature: string, idx: number) => (
            <li key={idx} className="flex items-start gap-3 text-sm">
              <Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
              <span className="text-white/60 leading-tight">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="flex justify-center mt-auto w-full pt-4">
          <PremiumButton
            label="Book a Call"
            className="w-full !py-3 !text-sm"
            onClick={() => window.open('https://cal.com/scale-forge-guqonp/30min', '_blank')}
          />
        </div>
      </div>
    </motion.div>
  );
};

const HomePricingSection = () => {
  const packages = [
    {
      tier: "Starter Package",
      price: "1,350",
      period: "Starting At",
      description: "Perfect for startups and small businesses that need branding and a professional website. You'll receive a custom visual identity, a high-performance Next.js website, and basic on-page SEO to launch your digital presence confidently.",
      bestFor: "Startups, personal brands, small local businesses",
      features: [
        "Full Brand Design & Guidelines",
        "Up to 5 Custom Pages",
        "Mobile Responsive Design",
        "Basic On-Page SEO & GSC Setup",
        "Website Copy (5 pages)",
        "2 Premium Blog Articles / Month"
      ]
    },
    {
      tier: "Growth Package",
      price: "1,850",
      period: "Starting At",
      popular: true,
      description: "Designed for businesses ready to capture more market share and generate consistent inbound leads. We implement a robust content strategy, advanced local SEO, speed optimization, and custom landing pages to maximize conversion rates.",
      bestFor: "Growing businesses, service providers, local brands",
      features: [
        "Everything in Starter, plus:",
        "Up to 10 Pages & Conversion Layouts",
        "Speed Optimization & Lead Capture",
        "Advanced Keyword & Local SEO",
        "4 Premium Blog Articles / Month",
        "Social Media & Landing Page Design"
      ]
    },
    {
      tier: "Scale Package",
      price: "2,500",
      period: "Starting At",
      description: "A complete, done-for-you digital growth engine for scaling businesses. We execute a full-scale technical SEO roadmap, aggressive link-building campaigns, premium UI/UX design, and high-frequency content publishing to establish unparalleled market authority.",
      bestFor: "Established businesses, agencies, e-commerce brands",
      features: [
        "Everything in Growth, plus:",
        "Up to 20 Pages & Premium UI/UX",
        "Full Technical SEO Strategy",
        "Competitor Analysis & Backlinks",
        "8 Blogs/mo & Conversion Copywriting",
        "Full Brand Identity & Messaging"
      ]
    }
  ];

  return (
    <section id="pricing" className="pt-24 pb-32 px-6 bg-black">
      <div className="max-w-[1400px] mx-auto pt-15">
        {/* Main Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-[10px] font-bold text-orange-500 tracking-[0.2em] uppercase mb-8"
          >
            Transparent Pricing
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-10"
          >
            Choose Your <span className="text-orange-500">Growth Path.</span>
          </motion.h2>
          <p className="text-white/70 text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Flexible, high-impact service models designed to scale with your business at every stage.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {packages.map((pkg, pkgIdx) => (
            <PricingCard
              key={pkg.tier}
              plan={pkg}
              planIdx={pkgIdx}
            />
          ))}
        </div>
        
        {/* Call to action for full pricing page */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <a href="/pricing" className="text-orange-500 hover:text-orange-400 text-sm font-semibold tracking-wider uppercase transition-colors border-b border-orange-500/30 hover:border-orange-500 pb-1">
            View All Services & Detailed Pricing
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HomePricingSection;
