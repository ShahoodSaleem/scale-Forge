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
          className="grid md:grid-cols-2 gap-1"
        >
          {/* Other Agencies */}
          <motion.div
            variants={leftCardVariants}
            className="bg-[#0A0A0B] border border-white/5 p-12 relative group"
          >
            <div className="mb-10 text-white/40 text-xl font-medium tracking-tight text-center">
              Other Agencies
            </div>
            <ul className="space-y-6">
              {otherAgencies.map((point, i) => (
                <motion.li
                  key={i}
                  variants={itemVariants}
                  className="flex items-center gap-4 text-white/50"
                >
                  <X className="w-5 h-5 text-red-500/50 shrink-0" />
                  <span className="text-lg">{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Scale Forge */}
          <motion.div
            variants={rightCardVariants}
            className="bg-[#111112] border border-white/10 p-12 relative overflow-hidden group"
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

            {/* Subtle Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] -z-10" />

            <div className="mb-10 flex items-center justify-center gap-3 text-white text-xl font-medium tracking-tight">
              Scale Forge
            </div>
            <ul className="space-y-6">
              {scaleForge.map((point, i) => (
                <motion.li
                  key={i}
                  variants={itemVariants}
                  className="flex items-center gap-4 text-white"
                >
                  <Check 
                    className="w-5 h-5 text-orange-500 shrink-0" 
                    style={{ filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.8))' }}
                  />
                  <span className="text-lg">{point}</span>
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
