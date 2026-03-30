"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Layout, Palette, FileText, Zap, BarChart3, Target, ArrowRight
} from 'lucide-react';

interface FeatureCardProps {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgImage: string;
  isExpanded: boolean;
  onHover: (id: string | null) => void;
  details: string[];
  metric: string;
}

const FeatureCard = ({ id, title, description, icon: Icon, color, bgImage, isExpanded, onHover, details, metric }: FeatureCardProps) => {
  const colorMap: Record<string, string> = {
    blue: 'rgba(255, 255, 255, 1)',
    purple: 'rgba(255, 255, 255, 0.2)',
    emerald: 'rgba(255, 255, 255, 0.2)',
    amber: 'rgba(255, 255, 255, 0.2)',
    rose: 'rgba(255, 255, 255, 0.2)',
    indigo: 'rgba(255, 255, 255, 0.2)',
    cyan: 'rgba(255, 255, 255, 0.2)',
  };

  const textColorMap: Record<string, string> = {
    blue: 'text-white',
    purple: 'text-white',
    emerald: 'text-white',
    amber: 'text-white',
    rose: 'text-white',
    indigo: 'text-white',
    cyan: 'text-white',
  };
  return (
    <motion.div
      layout
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => onHover(id)}
      className={`relative h-[700px] cursor-pointer overflow-hidden rounded-none border border-white/10 ${isExpanded ? 'bg-white/10 flex-[5]' : 'bg-white/5 flex-1 hover:bg-white/10'
        }`}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 scale-105"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Left-to-Right Gradient Fade */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-[1]" />

      {/* Background Overlay (Top-to-Bottom) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/80 z-[2]" />

      {/* Glow Effect when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ background: `radial-gradient(circle_at_center, ${colorMap[color]}, transparent 70%)` }}
            className="absolute inset-0 blur-[100px] pointer-events-none z-[3]"
          />
        )}
      </AnimatePresence>

      <div className="relative h-full flex flex-col p-8 items-center justify-between z-[50]">
        {/* Collapsed Title (Rotated) */}
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <span className="inline-block whitespace-nowrap text-lg font-semibold tracking-tighter text-white/20 uppercase rotate-[-90deg] origin-center">
                {title}
              </span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full"
            >
              <div className="flex flex-col gap-4">
                <span className={`text-xl font-medium tracking-tight uppercase italic ${textColorMap[color]}`}>
                  {title}
                </span>
                <p className="text-white/60 text-base leading-relaxed max-w-[280px]">
                  {description}
                </p>
                {/* Highlights List */}
                <ul className="mt-8 space-y-4">
                  {details.map((detail, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + (idx * 0.1) }}
                      className="flex items-center gap-3 text-white/80 text-sm font-medium"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                      {detail}
                    </motion.li>
                  ))}
                </ul>
                {/* Metric Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="mt-12 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 inline-block"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-1">Impact Metric</p>
                  <p className="text-2xl font-semibold text-white">{metric}</p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Icon */}
        <div className="mt-auto">
          <Icon className={`w-6 h-6 transition-colors ${isExpanded ? 'text-white' : 'text-white/30'}`} />
        </div>
      </div>
    </motion.div>
  );
};

const FeaturesAccordion = () => {
  const [hoveredId, setHoveredId] = useState<string | null>('7');

  const features = [
    { 
      id: '1', title: 'SEO Optimization', icon: Search, color: 'blue', bgImage: '/Assets/Cards/1.jpg', 
      description: 'Boost your search rankings with data-driven keyword strategies and technical audits.',
      details: ['Keyword Strategy', 'Technical Audits', 'Backlink Profile'],
      metric: '1.2M+ Reach'
    },
    { 
      id: '2', title: 'Web Design', icon: Layout, color: 'purple', bgImage: '/Assets/Cards/2.jpg', 
      description: 'High-conversion, premium interfaces designed to wow your customers and drive growth.',
      details: ['Custom UI/UX', 'Component Library', 'Interaction Design'],
      metric: '+65% Engagement'
    },
    { 
      id: '3', title: 'Branding', icon: Palette, color: 'emerald', bgImage: '/Assets/Cards/3.jpg', 
      description: 'Define your identity with unique visual systems and compelling brand storytelling.',
      details: ['Visual Identity', 'Brand Voice', 'Asset Guidelines'],
      metric: '100% Unique'
    },
    { 
      id: '4', title: 'Content Strategy', icon: FileText, color: 'amber', bgImage: '/Assets/Cards/4.jpg', 
      description: 'Engaging, high-quality content that resonates with your audience and builds authority.',
      details: ['Copywriting', 'Growth Roadmap', 'Media Planning'],
      metric: 'High Authority'
    },
    { 
      id: '5', title: 'Performance', icon: Zap, color: 'rose', bgImage: '/Assets/Cards/5.jpg', 
      description: 'Lightning-fast page speeds and core web vitals optimization for better UX.',
      details: ['Core Web Vitals', '0.4s Fast Load', 'LCP Optimization'],
      metric: '99+ Score'
    },
    { 
      id: '6', title: 'Analytics', icon: BarChart3, color: 'indigo', bgImage: '/Assets/Cards/6.jpg', 
      description: 'Deep-dive tracking and behavior analysis to optimize your conversion funnel.',
      details: ['Funnel Tracking', 'Behavior Analysis', 'ROI Reporting'],
      metric: 'Data-Driven'
    },
    { 
      id: '7', title: 'Digital Strategy', icon: Target, color: 'cyan', bgImage: '/Assets/Cards/7.jpg', 
      description: 'Comprehensive roadmaps designed to scale your business in the modern digital landscape.',
      details: ['Market Analysis', 'Scalability Audits', 'Growth Maps'],
      metric: 'Scaled Growth'
    },
  ];

  return (
    <section className="py-20 px-6 bg-black">
      <div id="features" className="max-w-[1440px] mx-auto scroll-mt-24">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">
            <span className="relative inline-block mr-3">

              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-white/20" />
            </span>
            What Scale Forge has to offer.
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            There’s even more to discover. Scale Forge brings you a collection of services designed to scale and elevate your business.
          </p>
        </div>

        <div
          className="flex flex-col md:flex-row gap-1 min-h-[700px]"
        >
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              {...feature}
              isExpanded={hoveredId === feature.id}
              onHover={setHoveredId}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesAccordion;
