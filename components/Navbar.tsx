"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import PremiumButton from "./PremiumButton";

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('#home');
  const isManualScrolling = useRef(false);

  const navLinks: { name: string; href: string; strikethrough?: boolean }[] = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    isManualScrolling.current = true;
    setActiveSection(href);

    // Release the lock after the smooth scroll finishes (approx 800ms)..
    setTimeout(() => {
      isManualScrolling.current = false;
    }, 800);
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px', // Detects section when it passes through the middle 20%
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      if (isManualScrolling.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    const sections = ['home', 'features', 'about', 'projects', 'faq', 'pricing', 'contact'];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    const handleScroll = () => {
      if (isManualScrolling.current) return;

      const scrollPosition = window.scrollY;
      const isAtBottom = window.innerHeight + scrollPosition >= document.documentElement.scrollHeight - 50;

      if (isAtBottom) {
        setActiveSection('#contact');
      } else if (scrollPosition < 50) {
        setActiveSection('#home');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0, x: "-50%" }}
      animate={{ y: 0, opacity: 1, x: "-50%" }}
      transition={{ duration: 1, delay: 3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-6 left-1/2 z-50 flex items-center h-14 px-2 rounded-full border border-white/10 bg-black/80 backdrop-blur-md"
    >
      <div className="flex items-center gap-1">
        <div className="pl-4 pr-6 text-white text-sm font-bold tracking-widest uppercase border-r border-white/10">
          Scale Forge
        </div>

        <div className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className={`relative px-4 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors duration-300 hover:text-white/80 z-10 ${isActive ? 'text-white' : link.strikethrough ? 'text-white/40 line-through decoration-white/20' : 'text-white/40'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute inset-0 z-[-1]"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.3),transparent_70%)]" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-orange-500 shadow-[0_0_8px_#f97316] rounded-b-full" />
                  </motion.div>
                )}
                {link.name}
              </a>
            );
          })}
        </div>

        <div className="pl-4 pr-1">
          <PremiumButton
            label="Book a Call"
            onClick={() => window.open('https://cal.com/scale-forge-guqonp/30min', '_blank')}
            className="scale-90"
          />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
