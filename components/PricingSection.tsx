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
      className="blob-card group min-h-[500px]"
    >
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

        <p className="text-white/50 text-xs mb-8 italic min-h-[32px]">
          {plan.description}
        </p>

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
      title: "Web Design & Development",
      description: "From stunning landing pages to complex e-commerce ecosystems.",
      plans: [
        {
          tier: "Starter",
          price: "999",
          period: "Single Page",
          description: "Perfect for a high-impact product launch or portfolio.",
          features: ["Custom UI/UX Design", "Fully Responsive", "Basic SEO Setup", "Contact Form", "3 Days Delivery"]
        },
        {
          tier: "Business",
          price: "1,999",
          period: "Multi-Page",
          popular: true,
          description: "Scalable websites for growing brands and companies.",
          features: ["Up to 5 Custom Pages", "CMS Integration", "Premium Animations", "Advanced SEO", "7-10 Days Delivery"]
        },
        {
          tier: "Elite",
          price: "3,499",
          period: "Custom App",
          description: "Complex solutions for enterprise-grade digital needs.",
          features: ["Full E-commerce Setup", "Custom Database", "API Integrations", "Priority Support", "Dedicated Project Manager"]
        }
      ]
    },
    {
      title: "SEO Mastery",
      description: "Strategic optimization to climb the rankings and dominate search.",
      plans: [
        {
          tier: "Essential",
          price: "499",
          period: "/Month",
          description: "The foundation for a solid search presence.",
          features: ["Keyword Research", "On-Page Optimization", "Technical SEO Audit", "Monthly Performance Report", "Local SEO Setup"]
        },
        {
          tier: "Growth",
          price: "999",
          period: "/Month",
          popular: true,
          description: "Aggressive optimization for competitive industries.",
          features: ["Competitor Analysis", "High-Quality Backlinks", "Content Strategy", "Speed Optimization", "Bi-Weekly Strategy Sync"]
        },
        {
          tier: "Dominance",
          price: "1,999",
          period: "/Month",
          description: "Full-scale authority building for market leaders.",
          features: ["PR & Guest Posting", "Advanced Link Building", "Voice Search SEO", "Conversion Rate Optimization", "Full Analytics War-room"]
        }
      ]
    },
    {
      title: "Content Creation",
      description: "Authority-building content that scales your brand's reach.",
      plans: [
        {
          tier: "Basic",
          price: "399",
          period: "/Month",
          description: "Keep your digital presence active and professional.",
          features: ["2 Premium Blog Articles", "4 Social Media Posts", "Basic Graphics", "Content Calendar", "1 Revision per post"]
        },
        {
          tier: "Pro",
          price: "799",
          period: "/Month",
          popular: true,
          description: "Dynamic content designed for high engagement.",
          features: ["6 Premium Blog Articles", "12 Social Media Posts", "Custom Graphics Pack", "Newsletter Design", "Engagement Analysis"]
        },
        {
          tier: "Authority",
          price: "1,499",
          period: "/Month",
          description: "The ultimate content machine for industry authority.",
          features: ["12 Premium Blog Articles", "Daily Social Posts", "Video Script Writing", "Whitepaper Creation", "Full Brand Voice Management"]
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


