"use client";

import { motion } from 'framer-motion';
import { Cpu, Zap, Globe } from 'lucide-react';
import YouTubePlayer from './YouTubePlayer';

const Badge = ({ icon: Icon, text }: { icon: any, text: string }) => (
  <div className="flex items-center gap-4 px-4 py-2 rounded-full border border-white/10 backdrop-blur-xl bg-white/5 text-white/80 text-sm font-medium">
    <Icon className="w-4 h-4 text-white/50" />
    <span>Integrated with {text}</span>
  </div>
);

const Hero = () => {
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
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <YouTubePlayer videoId="YDzKhixBDhg" />
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
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-10 mb-10">
          <Badge icon={Cpu} text="Core AI" />
          <Badge icon={Zap} text="Fast Deliverables" />
          <Badge icon={Globe} text="Global Reach" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-7xl md:text-[100px] font-medium tracking-tight text-white mb-8 leading-[1.05]"
        >
          Where Goals <br /> Meets Reality
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-white/60 max-w-2xl mb-12 leading-relaxed"
        >
          We help businesses achieve their goals through innovative solutions and cutting-edge technology. <br className="hidden md:block" />
          Scale your business with precision.
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
            onClick={() => window.open('Blogs', '_blank')}
            className="backdrop-blur-xl bg-white/5 border border-white/10 text-white/90 px-8 py-4 rounded-full text-base font-medium hover:bg-white/10 transition-all w-full sm:w-auto"
          >
            View Our Blogs
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
