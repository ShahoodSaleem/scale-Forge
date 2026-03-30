"use client";

import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <section id="about" className="py-60 px-6 bg-black flex flex-col items-center">
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

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/10">
          {[
            { label: 'Happy Clients', value: '250+' },
            { label: 'Projects Done', value: '480+' },
            { label: 'Expert Staff', value: '24' },
            { label: 'Awards Won', value: '12' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 + (idx * 0.1) }}
              className="flex flex-col items-center"
            >
              <span className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</span>
              <span className="text-xs uppercase tracking-widest text-white/40">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
