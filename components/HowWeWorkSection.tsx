"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function HowWeWorkSection() {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && diagramRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const diagramWidth = 1400; // Target width of the diagram
        
        if (containerWidth < diagramWidth) {
          const newScale = containerWidth / diagramWidth;
          setScale(newScale);
        } else {
          setScale(1);
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="bg-black py-24 px-6 md:px-12 w-full overflow-hidden relative">
      <div className="max-w-[1450px] w-full mx-auto flex flex-col gap-16">

        {/* Top Content Area */}
        <div className="w-full flex md:flex-row flex-col justify-between items-end gap-6 z-10">
          <div className="flex flex-col max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-orange-500 text-black font-semibold text-sm w-fit mb-6 shadow-[0_0_40px_rgba(255, 165, 0, 0.5)]"
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
            We compiled our development lifecycle into a mind map. This high-level diagram outlines the critical phases, technical milestones, and our parallel workflows from concept to deployment.
          </motion.p>
        </div>

        {/* Bottom Content Area: Mind Map Diagram */}
        <div 
          ref={containerRef}
          className="w-full relative overflow-visible flex justify-center items-center py-8"
          style={{ height: scale < 1 ? `calc(650px * ${scale})` : 'auto' }}
        >
          {/* Scaling Wrapper */}
          <div 
            ref={diagramRef}
            className="origin-center transition-transform duration-300 ease-out flex items-center justify-center"
            style={{ 
              transform: `scale(${scale})`,
              width: '1400px', // Maintain fixed internal width for consistent layout
              flexShrink: 0
            }}
          >
            {/* Main Diagram Container */}
            <div className="flex items-center justify-center relative select-none">

              {/* Level 1: Project Kickoff */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="px-6 py-3 rounded-xl bg-orange-500 text-black font-bold whitespace-nowrap shadow-orange-500/50 z-10"
              >
                Project Kickoff
              </motion.div>

              <Connector width="w-8" />

              {/* Level 2: Discovery */}
              <NodeGroup
                title="Discovery"
                delay={0.1}
                items={[
                  { label: "Initial Consultation" },
                  { label: "Requirements Gathering", highlight: true },
                  { label: "Scope Definition" },
                ]}
              />

              <Connector width="w-8" />

              {/* Level 3: Strategy & Planning */}
              <NodeGroup
                title="Strategy"
                delay={0.2}
                items={[
                  { label: "Goal Setting" },
                  { label: "Tech Stack Selection" },
                  { label: "Timeline Creation" },
                  { label: "Resource Allocation" },
                ]}
              />

              {/* SVG Mindmap Curvy Branches (Diverging) */}
              <div className="relative w-12 h-full flex-shrink-0 flex items-stretch">
                <svg
                  className="absolute inset-y-0 w-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  style={{ height: '100%' }}
                >
                  {/* From Center (0, 50) to the 3 branches */}
                  {/* Top row (~15%) */}
                  <path d="M 0 50 C 40 50, 60 15, 100 15" stroke="#333" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
                  {/* Middle row (50%) */}
                  <path d="M 0 50 L 100 50" stroke="#333" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
                  {/* Bottom row (~85%) */}
                  <path d="M 0 50 C 40 50, 60 85, 100 85" stroke="#333" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>

              {/* Level 4: 3 Parallel Branches */}
              <div className="flex flex-col gap-6 py-4 relative">

                {/* Branch 1: UI/UX -> Prototyping */}
                <div className="flex items-center relative z-10 min-h-[160px]">
                  <div className="flex items-center">
                    <NodeGroup
                      title="UI / UX Design"
                      delay={0.3}
                      items={[
                        { label: "Wireframing" },
                        { label: "Visual Design" },
                        { label: "User Testing" },
                      ]}
                    />
                    <Connector width="w-8" />
                    <NodeGroup
                      title="Prototyping"
                      delay={0.4}
                      fullHighlight={true}
                      items={[
                        { label: "Mockups" },
                        { label: "Client Feedback" },
                        { label: "Hand-off" },
                      ]}
                    />
                  </div>
                </div>

                {/* Branch 2: Frontend */}
                <div className="flex items-center relative z-10 min-h-[160px]">
                  <div className="flex items-center">
                    <NodeGroup
                      title="Frontend Dev"
                      delay={0.4}
                      items={[
                        { label: "React / Next.js Setup" },
                        { label: "State Management", highlight: true },
                        { label: "Responsive Layouts" },
                      ]}
                    />
                    {/* Invisible spacer to match the width of Prototyping column so convergences align */}
                    <div className="w-[180px] h-[2px] bg-[#333] flex-shrink-0" />
                  </div>
                </div>

                {/* Branch 3: Backend -> Integrations */}
                <div className="flex items-center relative z-10 min-h-[160px]">
                  <div className="flex items-center">
                    <NodeGroup
                      title="Backend Dev"
                      delay={0.5}
                      items={[
                        { label: "API Design" },
                        { label: "Database Schema" },
                        { label: "Security & Auth" },
                      ]}
                    />
                    <Connector width="w-8" />
                    <NodeGroup
                      title="Integrations"
                      delay={0.6}
                      items={[
                        { label: "Third-party APIs" },
                        { label: "Payment Gateways", highlight: true },
                        { label: "Analytics" },
                      ]}
                    />
                  </div>
                </div>

              </div>

              {/* SVG Mindmap Curvy Branches (Converging) */}
              <div className="relative w-12 h-full flex-shrink-0 flex items-stretch">
                <svg
                  className="absolute inset-y-0 w-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  style={{ height: '100%' }}
                >
                  {/* From the 3 branches back to the Center (100, 50) */}
                  {/* Top row (~15%) */}
                  <path d="M 0 15 C 40 15, 60 50, 100 50" stroke="#333" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
                  {/* Middle row (50%) */}
                  <path d="M 0 50 L 100 50" stroke="#333" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
                  {/* Bottom row (~85%) */}
                  <path d="M 0 85 C 40 85, 60 50, 100 50" stroke="#333" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>

              {/* Level 5: QA & Launch -> Project Completion */}
              <div className="flex flex-col justify-center h-full">
                <div className="flex items-center relative z-10">
                  <NodeGroup
                    title="QA & Launch"
                    delay={0.7}
                    fullHighlight={false}
                    items={[
                      { label: "Automated Testing" },
                      { label: "Performance Review", highlight: false },
                      { label: "Production Deployment", highlight: true },
                    ]}
                  />

                  <Connector width="w-8" />

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="px-6 py-3 rounded-xl bg-orange-500 text-black font-bold whitespace-nowrap shadow-orange-500/50 z-10"
                  >
                    Project Completion
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}

// Subcomponents

const Connector = ({ width = "w-5" }: { width?: string }) => (
  <div className={`${width} h-[2px] bg-[#333] flex-shrink-0 relative z-0`} />
);

interface NodeItem {
  label: string;
  highlight?: boolean;
}

interface NodeGroupProps {
  title: string;
  items: NodeItem[];
  delay: number;
  fullHighlight?: boolean;
}

const NodeGroup = ({ title, items, delay, fullHighlight = false }: NodeGroupProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay }}
      className="flex flex-col gap-2 flex-shrink-0 relative z-10 w-[160px]"
    >
      <div
        className={`text-[11px] px-3 py-1.5 rounded-lg w-fit transition-colors shadow-lg font-medium
          ${fullHighlight ? 'bg-orange-500 text-black shadow-orange-500/50' : 'bg-white/5 text-white/80'}`}
      >
        {title}
      </div>
      <div className="bg-white/10 p-2 rounded-xl flex flex-col gap-1.5 border border-white/5 shadow-xl">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`text-[11px] px-2.5 py-1.5 rounded-lg w-full transition-colors leading-tight
              ${item.highlight ? 'bg-orange-500 text-black font-semibold' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
          >
            {item.label}
          </div>
        ))}
      </div>
    </motion.div>
  );
};
