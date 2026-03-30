"use client";

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import PremiumButton from './PremiumButton';

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

        {/* Desktop Table - Grid Restored */}
        <div className="hidden md:block overflow-hidden border border-white/10 bg-white/[0.02]">
          {/* Table Header */}
          <div className="grid grid-cols-4 border-b border-white/10">
            <div className="p-8 border-r border-white/10" />
            {plans.map((plan) => (
              <div key={plan.name} className="p-8 border-r border-white/10 last:border-r-0 text-center">
                <div className="text-white/40 text-xs font-bold tracking-[0.1em] uppercase mb-4">{plan.name}</div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-medium text-white">
                    ${plan.price}
                  </span>
                  <span className="text-white/30 text-sm">/Month</span>
                </div>
              </div>
            ))}
          </div>

          {/* Features Rows */}
          {features.map((feature, idx) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="grid grid-cols-4 border-b border-white/5 hover:bg-white/[0.03] transition-colors group"
            >
              <div className="p-6 border-r border-white/10 text-white/50 font-medium text-sm transition-colors group-hover:text-white/90">
                {feature.name}
              </div>
              <div className="p-6 border-r border-white/10 flex items-center justify-center">
                {renderValue(feature.basic)}
              </div>
              <div className="p-6 border-r border-white/10 flex items-center justify-center">
                {renderValue(feature.pro)}
              </div>
              <div className="p-6 flex items-center justify-center">
                {renderValue(feature.enterprise)}
              </div>
            </motion.div>
          ))}

          {/* Table Footer - Buttons */}
          <div className="grid grid-cols-4 bg-white/[0.02]">
            <div className="p-8 border-r border-white/10" />
            {plans.map((plan) => (
              <div key={plan.name} className="p-8 border-r border-white/10 last:border-r-0 flex justify-center">
                <PremiumButton 
                  label="Get started" 
                  className="w-full max-w-[180px]" 
                  onClick={() => window.open('https://cal.com/scale-forge-guqonp/30min', '_blank')}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-12">
          {plans.map((plan, planIdx) => (
            <div key={plan.name} className="border border-white/10 bg-white/[0.02] p-8 rounded-2xl">
              <div className="text-white/40 text-xs font-bold tracking-[0.1em] uppercase mb-2">{plan.name}</div>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-medium text-white">
                  ${plan.price}
                </span>
                <span className="text-white/30 text-sm">/Month</span>
              </div>
              <ul className="space-y-4 mb-10">
                {features.map((f) => {
                  const val = planIdx === 0 ? f.basic : planIdx === 1 ? f.pro : f.enterprise;
                  return (
                    <li key={f.name} className="flex items-center justify-between text-sm">
                      <span className="text-white/30">{f.name}</span>
                      <span>{renderValue(val)}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="flex justify-center">
                <PremiumButton 
                  label="Get started" 
                  className="w-full" 
                  onClick={() => window.open('https://cal.com/scale-forge-guqonp/30min', '_blank')}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
