"use client";

import { motion } from 'framer-motion';
import { Cpu, Zap, Globe } from 'lucide-react';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

const Badge = ({ icon: Icon, text }: { icon: any, text: string }) => (
  <div className="flex items-center gap-4 px-4 py-2 rounded-full border border-white/10 backdrop-blur-xl bg-white/5 text-white/80 text-sm font-medium">
    <Icon className="w-4 h-4 text-white/50" />
    <span>Integrated with {text}</span>
  </div>
);

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const videoSrc = mounted && theme === 'light' ? '/Assets/WhiteWaves.mp4' : '/Assets/Hero_Dark_compressed.mp4';
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 5.2, // Clearly after Navbar and Video
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 26 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as any } },
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center pt-32 px-6 overflow-hidden">
      {/* Background Video - Properly layered and delayed */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 3.8 }}
        className="absolute inset-0 z-0 pointer-events-none bg-black"
      >
        <div className={`relative w-full h-full transition-opacity duration-[3000ms] ease-in-out ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <video
            key={videoSrc}
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster="/Assets/assets/hero1.png"
            onCanPlay={() => setIsVideoLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Subtle Overlay to enhance text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
        {/* Seamless Transition Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/70 to-transparent z-[1]" />
      </motion.div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center text-center max-w-4xl"
      >
        {/* Badges */}
        <motion.div variants={itemVariants} className="hidden md:flex flex-wrap items-center justify-center gap-10 mb-10">
          <Badge icon={Cpu} text="Core AI" />
          <Badge icon={Zap} text="Fast Deliverables" />
          <Badge icon={Globe} text="Global Reach" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-7xl md:text-[90px] font-medium tracking-tight text-white mb-8 leading-[1.05]"
        >
          Building Businesses Around The Globe
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-white/60 max-w-2xl mb-12 leading-relaxed"
        >
          designing and developing fast, professional websites for your business with high-coverting SEO & marketing strategies

        </motion.p>

        {/* Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => window.open('https://cal.com/scale-forge-guqonp/30min', '_blank')}
            className="backdrop-blur-xl bg-white/5 border border-white/10 text-white/90 px-8 py-4 rounded-full text-base font-medium hover:bg-white/10 transition-all w-full sm:w-auto"
          >
            Let's Get Started
          </button>
          <button
            onClick={() => window.location.href = '/projects'}
            className="backdrop-blur-xl bg-white/5 border border-white/10 text-white/90 px-8 py-4 rounded-full text-base font-medium hover:bg-white/10 transition-all w-full sm:w-auto"
          >
            View Our Work
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
