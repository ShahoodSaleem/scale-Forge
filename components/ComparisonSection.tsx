"use client";

import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

const ComparisonSection = () => {
  const headingText = "But, why would you want to work with us?";
  const words = headingText.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any },
    },
  };

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const leftCardVariants = {
    hidden: { opacity: 0, x: -500 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as any }
    },
  };

  const rightCardVariants = {
    hidden: { opacity: 0, x: 500 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as any }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 1.4 } // Fade in after cards arrive
    },
  };

  const otherAgencies = [
    "Reactive communication",
    "Single channel approach",
    "Copy paste growth strategies",
    "Lack of research on your industry",
    "Outsourced to junior talent",
  ];

  const scaleForge = [
    "Constant, proactive communication",
    "Omni channel approach",
    "Tailored best-fit solutions",
    "Provides industry specific expertise",
    "Experts with 10+ years of experience",
  ];

  return (
    <section className="py-24 px-6 bg-black overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        {/* Animated Heading */}
        <motion.h2
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white text-center mb-20"
        >
          {words.map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.3em]">
              {word.split('').map((char, charIndex) => (
                <motion.span
                  key={charIndex}
                  variants={letterVariants}
                  className={`inline-block ${word.toLowerCase() === 'with' || word.toLowerCase() === 'us?' ? 'italic font-light opacity-80' : ''}`}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.h2>

        {/* Cards Container */}
        <motion.div
          variants={cardContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto"
        >
          {/* VS Badge */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-black border border-white/10 items-center justify-center shadow-2xl shadow-black">
            <div className="absolute inset-0 rounded-full bg-orange-500/10 animate-pulse" />
            <span className="text-white/40 font-mono text-sm italic relative z-10">VS</span>
          </div>

          {/* Other Agencies */}
          <motion.div
            variants={leftCardVariants}
            className="flex-1 relative p-8 md:p-12 rounded-[2rem] border border-white/5 bg-black/50 backdrop-blur-md overflow-hidden group transition-colors hover:border-white/10"
          >
            {/* Dark red gradient at top */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />
            
            <div className="mb-12 flex items-center justify-between relative z-20">
              <h3 className="text-xl font-medium text-white/50 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-white/20" />
                Other Agencies
              </h3>
            </div>
            
            <ul className="space-y-8 relative z-20">
              {otherAgencies.map((point, i) => (
                <motion.li
                  key={i}
                  variants={itemVariants}
                  className="flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-4 h-4 text-white/20" />
                  </div>
                  <span className="text-white/40 leading-relaxed font-light">{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Scale Forge */}
          <motion.div
            variants={rightCardVariants}
            className="flex-1 relative p-8 md:p-12 rounded-[2rem] border border-orange-500/30 bg-black backdrop-blur-xl overflow-hidden shadow-[0_0_80px_-20px_color-mix(in_srgb,var(--color-orange-600)_15%,transparent)] group transition-all hover:shadow-[0_0_100px_-20px_color-mix(in_srgb,var(--color-orange-600)_25%,transparent)] hover:border-orange-500/50"
          >
            {/* Animated Glare */}
            <motion.div
              initial={{ x: '-150%', skewX: -45 }}
              animate={{ x: '250%' }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-orange-600/5 via-orange-600/20 via-orange-600/5 to-transparent blur-3xl pointer-events-none z-10"
            />

            {/* Glowing Corner */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-orange-500/10 blur-[120px] pointer-events-none rounded-full translate-x-1/2 -translate-y-1/2" />
            
            {/* Subtle Bottom Glow */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/10 blur-[100px] pointer-events-none" />

            <div className="mb-12 flex items-center justify-between relative z-20">
              <h3 className="text-2xl font-medium text-white flex items-center gap-3">
                <span className="w-12 h-[2px] bg-orange-500 shadow-[0_0_10px_var(--color-orange-600)]" />
                Scale Forge
              </h3>
            </div>
            
            <ul className="space-y-8 relative z-20">
              {scaleForge.map((point, i) => (
                <motion.li
                  key={i}
                  variants={itemVariants}
                  className="flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-600 to-orange-400 p-[1px] shrink-0 mt-0.5 shadow-[0_0_20px_color-mix(in_srgb,var(--color-orange-600)_40%,transparent)]">
                    <div className="w-full h-full bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-orange-500" />
                    </div>
                  </div>
                  <span className="text-white text-lg leading-relaxed font-medium">{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonSection;
