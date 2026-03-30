"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PremiumButton from "./PremiumButton";

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('#home');

  const navLinks: { name: string; href: string; strikethrough?: boolean }[] = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px', // Detects section when it passes through the middle 20%
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    const sections = ['home', 'features', 'about', 'projects', 'faq', 'pricing'];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 w-full z-50 border-b border-white/10 backdrop-blur-md bg-black/20"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="text-white text-xl font-medium tracking-tight">
          Scale Forge
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  const targetId = link.href.replace('#', '');
                  const elem = document.getElementById(targetId);
                  if (elem) {
                    elem.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    });
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`text-sm font-medium transition-all duration-300 hover:text-white/80 ${isActive
                  ? 'px-3 py-1 rounded-full border border-white/20 bg-gradient-to-r from-white/10 to-transparent shadow-[0_0_20px_rgba(255,255,255,0.05)] text-white'
                  : link.strikethrough
                    ? 'text-white/40 line-through decoration-white/20'
                    : 'text-white/60'
                  }`}
              >
                {link.name}
              </a>
            );
          })}
        </div>

        <PremiumButton 
          label="Book a Call" 
          onClick={() => window.open('https://cal.com/scale-forge-guqonp/30min', '_blank')}
        />
      </div>
    </motion.nav>
  );
};

export default Navbar;
