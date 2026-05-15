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
      className="blob-card group min-h-[500px] bg-black"
    >
      <div className="blob-bg bg-black/85"></div>
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

        <p className="text-white/50 text-xs mb-4 italic min-h-[32px]">
          {plan.description}
        </p>

        {plan.bestFor && (
          <div className="mb-6 text-[11px]">
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

const PricingSection = () => {
  const serviceGroups = [
    {
      title: "All-in-One Growth Packages",
      description: "Complete, done-for-you digital growth engines combining branding, web, SEO, and content creation into one seamless monthly retainer.",
      plans: [
        {
          tier: "Starter Package",
          price: "1,350",
          period: "Starting At",
          description: "Perfect for startups and small businesses that need branding and a professional website.",
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
          description: "Designed for businesses ready to capture more market share and generate consistent inbound leads.",
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
          description: "A complete, done-for-you digital growth engine for scaling businesses.",
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
      ]
    },
    {
      title: "Web Design & Development",
      description: "From stunning landing pages to complex e-commerce ecosystems.",
      plans: [
        {
          tier: "Starter",
          price: "1,800",
          period: "/ project",
          description: "A clean, professional site for individuals and small businesses just getting online.",
          features: [
            "Up to 5 pages",
            "Mobile responsive design",
            "Contact form integration",
            "2 rounds of revisions",
            "30-day post-launch support"
          ]
        },
        {
          tier: "Growth",
          price: "4,500",
          period: "/ project",
          popular: true,
          description: "A full-featured site for growing brands that need custom design and more functionality.",
          features: [
            "Up to 15 pages",
            "Custom UI/UX design",
            "CMS integration (WordPress/Webflow)",
            "Basic SEO setup",
            "4 rounds of revisions",
            "60-day post-launch support"
          ]
        },
        {
          tier: "Enterprise",
          price: "9,500+",
          period: "/ project",
          description: "High-performance, scalable web solutions for established businesses with complex needs.",
          features: [
            "Unlimited pages",
            "Custom development & integrations",
            "E-commerce / portal functionality",
            "Performance & security hardening",
            "Unlimited revisions",
            "90-day dedicated support"
          ]
        }
      ]
    },
    {
      title: "SEO",
      description: "Strategic optimization to climb the rankings and dominate search.",
      plans: [
        {
          tier: "Essential",
          price: "650",
          period: "/month",
          description: "Core SEO for businesses building their organic presence from the ground up.",
          features: [
            "Keyword research (20 keywords)",
            "On-page optimization",
            "Google Search Console setup",
            "Monthly performance report",
            "Technical SEO audit"
          ]
        },
        {
          tier: "Authority",
          price: "1,400",
          period: "/month",
          popular: true,
          description: "Comprehensive SEO for brands serious about ranking higher and driving qualified traffic.",
          features: [
            "Keyword research (60 keywords)",
            "On-page + technical optimization",
            "Link building (10 links/mo)",
            "Competitor analysis",
            "Bi-weekly strategy calls",
            "Detailed monthly reporting"
          ]
        },
        {
          tier: "Dominate",
          price: "3,200",
          period: "/month",
          description: "Aggressive SEO strategy for businesses that need to own their market's search results.",
          features: [
            "Unlimited keyword targeting",
            "Full technical SEO management",
            "Link building (25+ links/mo)",
            "Content strategy alignment",
            "Weekly strategy calls",
            "Dedicated SEO manager"
          ]
        }
      ]
    },
    {
      title: "Content Creation",
      description: "Authority-building content that scales your brand's reach.",
      plans: [
        {
          tier: "Essentials",
          price: "900",
          period: "/month",
          description: "Consistent, quality content for businesses looking to build a strong online presence.",
          features: [
            "4 blog articles / month",
            "8 social media posts",
            "Basic graphic design",
            "Content calendar",
            "1 revision per piece"
          ]
        },
        {
          tier: "Professional",
          price: "2,200",
          period: "/month",
          popular: true,
          description: "High-impact content designed to build authority and drive consistent organic traffic.",
          features: [
            "8 blog articles / month",
            "20 social media posts",
            "Custom branded graphics",
            "Email newsletter design",
            "SEO-optimized copywriting",
            "Engagement & performance analysis"
          ]
        },
        {
          tier: "Full-Scale",
          price: "4,800",
          period: "/month",
          description: "An end-to-end content engine for businesses ready to dominate their niche.",
          features: [
            "16 blog articles / month",
            "Daily social media posts",
            "Video script writing",
            "Whitepaper & lead magnet creation",
            "Full brand voice management",
            "Dedicated content strategist"
          ]
        }
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
        }
        .blob-bg {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 2;
          backdrop-filter: blur(16px);
        }
        .blob-element {
          position: absolute;
          z-index: 1;
          width: 300px; height: 300px;
          border-radius: 50%;
          background-color: var(--color-orange-600);
          opacity: 0.5;
          filter: blur(50px);
          pointer-events: none;
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto pt-15">
        {/* Main Header */}
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-[10px] font-bold text-orange-500 tracking-[0.2em] uppercase mb-8"
          >
            Scale Your Business
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

        {/* Service Groupings */}
        <div className="space-y-40">
          {serviceGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="relative">
              {/* Group Heading */}
              <div className="mb-16">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-6 mb-4"
                >
                  <div className="h-[2px] w-12 bg-orange-500 shadow-[0_0_10px_rgba(234,88,12,0.5)]" />
                  <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight">{group.title}</h3>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-white/40 text-lg md:text-xl max-w-2xl"
                >
                  {group.description}
                </motion.p>
              </div>

              {/* Grid for this group */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {group.plans.map((plan, planIdx) => (
                  <PricingCard
                    key={plan.tier}
                    plan={plan}
                    planIdx={planIdx + (groupIdx * 3)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;


