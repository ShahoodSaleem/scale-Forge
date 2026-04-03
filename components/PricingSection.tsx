"use client";

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Check, X } from 'lucide-react';
import PremiumButton from './PremiumButton';
import { useEffect, useRef } from 'react';

const PricingCard = ({ plan, planIdx, features, renderValue }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
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
        className="blob-element transition-opacity duration-500 opacity-20 group-hover:opacity-80" 
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
        <div className="text-white/40 text-xs font-bold tracking-[0.1em] uppercase mb-4 text-center">{plan.name}</div>
        <div className="flex items-baseline justify-center gap-1 mb-8 pb-8 border-b border-white/10">
          <span className="text-5xl font-medium text-white">
            ${plan.price}
          </span>
          <span className="text-white/30 text-sm">/Month</span>
        </div>
        
        <ul className="space-y-4 mb-10 flex-grow">
          {features.map((f: any) => {
            const val = planIdx === 0 ? f.basic : planIdx === 1 ? f.pro : f.enterprise;
            return (
              <li key={f.name} className="flex items-center justify-between text-sm">
                <span className="text-white/60 pr-4">{f.name}</span>
                <div className="flex-shrink-0">{renderValue(val)}</div>
              </li>
            );
          })}
        </ul>
        
        <div className="flex justify-center mt-auto w-full pt-6">
          <PremiumButton 
            label="Get started" 
            className="w-full" 
            onClick={() => window.open('https://cal.com/scale-forge-guqonp/30min', '_blank')}
          />
        </div>
      </div>
    </motion.div>
  );
};

const PricingSection = () => {
  const plans = [
    { name: 'Basic plan', price: 900 },
    { name: 'Pro plan', price: 1100 },
    { name: 'Enterprise plan', price: 1400 },
  ];

  const features = [
    { name: 'Public forms', basic: true, pro: true, enterprise: true },
    { name: 'Tailored notifications', basic: true, pro: true, enterprise: true },
    { name: 'Adjustable fields', basic: 'Limited', pro: true, enterprise: true },
    { name: 'Adjustable premium integrations', basic: 'Limited', pro: 'Limited', enterprise: true },
    { name: 'Action log', basic: true, pro: true, enterprise: true },
    { name: 'Endless dashboards', basic: true, pro: true, enterprise: true },
    { name: 'Kanban layout', basic: 'Limited', pro: true, enterprise: true },
    { name: 'Timeline display', basic: 'Limited', pro: 'Limited', enterprise: true },
  ];

  const renderValue = (val: boolean | string) => {
    if (val === true) return (
      <div className="flex justify-center">
        <Check
          className="w-5 h-7 text-orange-500"
          style={{ filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 1))' }}
        />
      </div>
    );
    if (val === false) return (
      <div className="flex justify-center">
        <X className="w-5 h-5 text-white/10" />
      </div>
    );
    return <span className="text-white/80 text-sm font-medium">{val}</span>;
  };

  return (
    <section id="pricing" className="pt-20 pb-24 px-6 bg-black">
      <style>{`
        .blob-card {
          position: relative;
          border-radius: 14px;
          z-index: 10;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 20px 20px 60px rgba(0,0,0,0.4), -20px -20px 60px rgba(255,255,255,0.02);
        }

        .blob-bg {
          position: absolute;
          top: 2px;
          left: 2px;
          right: 2px;
          bottom: 2px;
          z-index: 2;
          background: rgba(20, 20, 20, 0.85);
          backdrop-filter: blur(24px);
          border-radius: 12px;
          outline: 1px solid rgba(255, 255, 255, 0.05);
        }

        .blob-element {
          position: absolute;
          z-index: 1;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          background-color: #ea580c;
          opacity: 0.8;
          filter: blur(24px);
          pointer-events: none;
        }
      `}</style>
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] font-bold text-white/40 tracking-[0.2em] uppercase mb-6"
          >
            Pricing
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-medium tracking-tight text-white font-heading mb-6"
          >
            Simple and transparent pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-white/40 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Streamline your business's financial management with our intuitive, scalable SaaS platform. Designed for U.S. enterprises, our solutions simplify complex processes.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, planIdx) => (
            <PricingCard 
                key={plan.name} 
                plan={plan} 
                planIdx={planIdx} 
                features={features} 
                renderValue={renderValue} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
