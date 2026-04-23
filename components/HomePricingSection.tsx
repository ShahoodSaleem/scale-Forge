"use client";

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Check } from 'lucide-react';
import PremiumButton from './PremiumButton';
import { useEffect, useRef } from 'react';

const PricingCard = ({ plan, planIdx }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

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
    <motion.div
      ref={cardRef as any}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: planIdx * 0.1 }}
      className={`blob-card group min-h-[500px] transition-all duration-500 ${
        plan.popular 
          ? '!border-transparent relative z-20 md:-translate-y-2' 
          : 'hover:!border-white/10'
      }`}
    >
      {/* Outer static glow for popular card */}
      {plan.popular && (
        <div className="absolute inset-0 rounded-[20px] shadow-[0_0_50px_rgba(234,88,12,0.15)] pointer-events-none z-0" />
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
              background: "conic-gradient(from 0deg, transparent 40%, rgba(234, 88, 12, 0.1) 60%, rgba(234, 88, 12, 0.8) 90%, rgba(255, 138, 26, 1) 100%)"
            }}
          />
        </div>
      )}
      <div className="blob-bg"></div>
      <motion.div
        className="blob-element transition-opacity duration-1000 opacity-30 md:opacity-20 group-hover:opacity-80"
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

        <p className="text-white/50 text-xs mb-4 italic min-h-[48px]">
          {plan.description}
        </p>

        {plan.bestFor && (
          <div className="mb-6 text-xs">
            <span className="font-bold text-orange-500">Best For: </span>
            <span className="text-white/60">{plan.bestFor}</span>
          </div>
        )}

        <ul className="space-y-3 mb-8 flex-grow">
          {plan.features.map((feature: string, idx: number) => (
            <li key={idx} className="flex items-start gap-3 text-xs">
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
      description: "Perfect for startups and small businesses that need branding + a professional website to get started.",
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
      description: "Designed for businesses that want a stronger digital presence with better SEO and ongoing content.",
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
      description: "A complete digital growth package combining branding, design, SEO, and content strategy for scaling businesses.",
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
      <style>{`
        .blob-card {
          position: relative;
          border-radius: 20px;
          z-index: 10;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          background: #080808;
        }

        .blob-bg {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 2;
          background: rgba(8, 8, 8, 0.85);
          backdrop-filter: blur(16px);
        }

        .blob-element {
          position: absolute;
          z-index: 1;
          width: 300px; height: 300px;
          border-radius: 50%;
          background-color: #ea580c;
          opacity: 0.5;
          filter: blur(50px);
          pointer-events: none;
        }
      `}</style>

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
          <p className="text-white/40 text-xl max-w-2xl mx-auto font-light leading-relaxed">
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
