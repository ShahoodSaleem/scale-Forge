"use client";

import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <section id="about" className="mt-60 mb-30 px-6 bg-black flex flex-col items-center">
      <div className="max-w-4xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-orange-500 font-semibold uppercase tracking-widest text-sm mb-6 block"
        >
          Our Story
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-medium tracking-tight mb-8 text-white"
        >
          Forging the Future of <br className="hidden md:block" /> Digital Excellence
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-white/60 leading-relaxed mb-12"
        >
          Scale Forge is more than just a agency; we are your strategic partner in growth.
          Born from the intersection of innovative design and data-driven insights, we help
          ambitious brands navigate the complexities of the modern digital landscape.
          Our mission is to scale your business with precision, purpose, and premium aesthetics.
        </motion.p>


      </div>
    </section>
  );
};

export default AboutSection;
