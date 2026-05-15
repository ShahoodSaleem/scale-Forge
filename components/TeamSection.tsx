"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import ShahoodImg from "../assets/Shahood.avif";
import RuhanImg from "../assets/Ruhan_2.avif";

const teamMembers = [
  {
    role: "Founder / CEO",
    name: "Shahood Saleem",
    description: "As Chief Executive Officer and Strategic Lead at Scale Forge, Shahood Saleem drives the company’s vision, client strategy, and digital growth initiatives. With a focus on web strategy, automation, and scalable systems, he helps businesses build strong digital foundations that improve performance, increase conversions, and support long-term growth.",
    image: ShahoodImg
  },
  {
    role: "Partner / CTO",
    name: "Ruhan Bhaleshah",
    description: "Ruhan is the Chief Technology Officer at Scale Forge, leading the development of the systems and technologies that power the company’s digital solutions. With expertise in SEO systems, AI automation, and technical infrastructure, he builds scalable frameworks that improve efficiency, support growth, and ensure every strategy is backed by data-driven performance.",
    image: RuhanImg
  }
];

export default function TeamSection() {
  return (
    <section className="bg-black py-24 px-6 md:px-12 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl md:text-5xl font-bold mb-16 text-white text-center md:text-left font-heading"
        >
          Meet the Team
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col group cursor-pointer"
            >
              {/* Image Container */}
              <div className="w-full aspect-[3/4] bg-black mb-8 relative overflow-hidden flex flex-col items-center justify-center border border-white/5 transition-colors duration-500 group-hover:border-white/10">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-center grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index === 0}
                />
              </div>

              {/* Content */}
              <div className="flex flex-col">
                <motion.h4
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + (index * 0.3) }}
                  className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-red-500 mb-4 transition-colors duration-300 group-hover:text-red-400"
                >
                  {member.role}
                </motion.h4>
                <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6 tracking-tight">
                  {member.name}
                </h3>
                <p className="text-sm md:text-base text-white/60 leading-relaxed font-light w-full lg:w-11/12">
                  {member.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
