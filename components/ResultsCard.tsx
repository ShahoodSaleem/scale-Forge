"use client";

import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';

interface Stat {
  value: string;
  suffix: string;
  label: string;
}

interface ResultsCardProps {
  stats?: Stat[];
  description?: string;
}

const ResultsCard = ({
  stats = [
    { value: '384', suffix: '%', label: 'Increase in Organic Traffic' },
    { value: '2.4', suffix: 'x', label: 'Higher Conversion Rate' },
    { value: 'No.1', suffix: '', label: 'Position for 12 Keywords within 4 Months' }
  ],
  description = "This breakdown shows the immediate impact of the deliverables upon launch, securing long-term growth and stability for the client's web presence."
}: ResultsCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springX = useSpring(mouseX, { stiffness: 150, damping: 40 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 40 });

  const rectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    // Only run mouse tracking on desktop
    if (window.innerWidth <= 768) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      if (!rectRef.current) {
        rectRef.current = cardRef.current.getBoundingClientRect();
      }
      mouseX.set(e.clientX - rectRef.current.left);
      mouseY.set(e.clientY - rectRef.current.top);
    };

    const handleMouseEnter = () => {
      if (cardRef.current) {
        rectRef.current = cardRef.current.getBoundingClientRect();
      }
    };

    const node = cardRef.current;
    if (node) {
      node.addEventListener("mouseenter", handleMouseEnter);
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (node) {
        node.removeEventListener("mouseenter", handleMouseEnter);
      }
    };
  }, [mouseX, mouseY]);

  // Bright Blue for light mode, Bright Orange for dark mode
  const glowGradient = useMotionTemplate`radial-gradient(
    600px circle at ${springX}px ${springY}px, 
    var(--glow-color), 
    transparent 80%
  )`;

  return (
    <div
      ref={cardRef}
      className="my-16 relative group rounded-2xl p-[1.5px] overflow-hidden transition-all duration-300"
      style={{
        // Define theme colors as CSS variables
        "--glow-color": "rgba(59, 130, 246, 0.5)" // Blue-500
      } as any}
    >
      {/* Glow Layer (Peeks through the 1.5px padding to form the border) */}
      <motion.div
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:hidden"
        style={{ background: glowGradient }}
      />

      {/* Dark Mode Glow Layer */}
      <motion.div
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden dark:block"
        style={{
          background: useMotionTemplate`radial-gradient(
            600px circle at ${springX}px ${springY}px, 
            rgba(249, 115, 22, 0.6), 
            transparent 80%
          )`
        }}
      />

      {/* Main Card Content */}
      <div className="relative z-10 bg-white dark:bg-[#030303] border border-black/5 dark:border-white/5 rounded-[15px] p-8 md:p-12 backdrop-blur-xl overflow-hidden h-full w-full">
        {/* Static Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <h3 className="text-black dark:text-white font-medium text-2xl mb-12 flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-orange-500" />
          Results & Impact
          <div className="flex-1 h-[1px] bg-gradient-to-r from-black/10 to-transparent dark:from-white/10" />
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col">
              <div className="text-5xl font-medium text-black dark:text-white mb-2 leading-none">
                {stat.value}<span className="text-blue-500 dark:text-orange-500">{stat.suffix}</span>
              </div>
              <div className="text-black/40 dark:text-white/40 text-[10px] font-bold uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {description && (
          <p className="text-black/70 dark:text-white/80 leading-relaxed border-t border-black/10 dark:border-white/10 pt-6 mt-6">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResultsCard;
