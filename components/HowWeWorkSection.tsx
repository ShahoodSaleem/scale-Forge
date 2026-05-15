"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

interface Step {
  title: string;
  items?: string[];
  highlight?: string;
  isStart?: boolean;
  isEnd?: boolean;
}

const steps: Step[] = [
  {
    title: "Project Kickoff",
    isStart: true,
  },
  {
    title: "Discovery",
    items: ["Initial Consultation", "Requirements Gathering", "Scope Definition"],
    highlight: "Requirements Gathering"
  },
  {
    title: "Strategy",
    items: ["Goal Setting", "Tech Stack Selection", "Timeline Creation", "Resource Allocation"],
  },
  {
    title: "Design",
    items: ["Wireframing", "Visual Design", "User Testing", "Prototyping"],
    highlight: "Prototyping"
  },
  {
    title: "Development",
    items: ["React / Next.js Setup", "API Design", "Database Schema", "Security & Auth", "Integrations"],
    highlight: "Security & Auth"
  },
  {
    title: "QA & Launch",
    items: ["Automated Testing", "Performance Review", "Production Deployment"],
    highlight: "Production Deployment"
  },
  {
    title: "Project Completion",
    isEnd: true,
  }
];

export default function HowWeWorkSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-black py-24 px-6 md:px-12 w-full overflow-hidden relative">
      <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-20">

        {/* Top Content Area */}
        <div className="w-full flex md:flex-row flex-col justify-between items-end gap-8 z-10">
          <div className="flex flex-col max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-orange-500 text-black font-semibold text-sm w-fit mb-6 shadow-[0_0_30px_rgba(255,165,0,0.3)] shadow-orange-500/50"
            >
              our process
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-white text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight"
            >
              How We Build <br />
              <span className="text-orange-500">Exceptional Software.</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-white/60 text-base md:text-lg leading-relaxed max-w-md pb-2"
          >
            We've refined our development lifecycle into a streamlined vertical roadmap. This sequence ensures every project moves from vision to reality with precision and speed.
          </motion.p>
        </div>

        {/* Vertical Timeline Area */}
        <div className="relative mt-10 md:mt-20">
          {/* The Timeline Spine */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-orange-500 via-orange-500/50 to-transparent transform md:-translate-x-1/2" />

          <div className="flex flex-col gap-12 md:gap-20 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-start md:items-center w-full ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Step Marker (Circle on the line) */}
                <div className="absolute left-[20px] md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-orange-500 border-4 border-black z-20 shadow-[0_0_15px_rgba(255,165,0,0.8)]" />

                {/* Content Card */}
                <div className={`w-full md:w-[45%] pl-12 md:pl-0 ${index % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left"}`}>
                  {step.isStart || step.isEnd ? (
                    <div className={`inline-block px-8 py-4 rounded-2xl bg-orange-500 text-black font-black text-xl md:text-2xl shadow-[0_0_40px_rgba(255,165,0,0.3)] uppercase tracking-wider`}>
                      {step.title}
                    </div>
                  ) : (
                    <div className="group">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-orange-500 transition-colors">
                        {step.title}
                      </h3>
                      <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? "md:justify-end" : "md:justify-start"}`}>
                        {step.items?.map((item, i) => (
                          <span
                            key={i}
                            className={`text-[12px] md:text-sm px-4 py-2 rounded-xl transition-all border ${
                              item === step.highlight
                                ? "bg-orange-500 text-black border-orange-500 font-bold shadow-[0_5px_15px_rgba(255,165,0,0.2)]"
                                : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:border-white/20"
                            }`}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Spacer for MD screens to keep alignment */}
                <div className="hidden md:block w-[45%]" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* SEO / Detailed Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-7xl mx-auto z-10 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="p-10 rounded-[30px] bg-white/[0.03] backdrop-blur-sm border border-white/5 hover:border-orange-500/30 transition-all group">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-orange-500 text-black flex items-center justify-center text-sm font-bold">1</span>
              Discovery & Strategy
            </h3>
            <p className="text-white/60 text-base leading-relaxed">
              We begin every project by deeply understanding your business goals, target audience, and market positioning. Our discovery phase involves comprehensive research and strategy sessions where we map out the technical requirements, design direction, and SEO objectives.
            </p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="p-10 rounded-[30px] bg-white/[0.03] backdrop-blur-sm border border-white/5 hover:border-orange-500/30 transition-all group">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-orange-500 text-black flex items-center justify-center text-sm font-bold">2</span>
              Design & Development
            </h3>
            <p className="text-white/60 text-base leading-relaxed">
              Once the strategy is set, our expert team moves into parallel workflows. We craft stunning, user-centric interfaces while simultaneously architecting robust, scalable backend systems. Using cutting-edge technologies like Next.js and Tailwind CSS.
            </p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="p-10 rounded-[30px] bg-white/[0.03] backdrop-blur-sm border border-white/5 hover:border-orange-500/30 transition-all group">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-orange-500 text-black flex items-center justify-center text-sm font-bold">3</span>
              QA, Launch & Growth
            </h3>
            <p className="text-white/60 text-base leading-relaxed">
              Before any project goes live, it undergoes rigorous quality assurance testing to guarantee flawless functionality across all devices and browsers. After deployment, we monitor performance, analyze user behavior, and continuously optimize for SEO and speed.
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
