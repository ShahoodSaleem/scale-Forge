"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import PremiumButton from "./PremiumButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (pathname?.startsWith('/portal') || pathname?.startsWith('/studio')) return null;

  const glowClass = mounted && theme === 'light'
    ? 'text-black [text-shadow:0_0_8px_#00f3ff,0_0_16px_#00f3ff,0_0_24px_#00c8ff]'
    : 'text-white [text-shadow:0_0_8px_#f97316,0_0_16px_#f97316,0_0_24px_#ea580c]';

  const navLinks: { name: string; href: string; strikethrough?: boolean }[] = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0, x: "-50%" }}
        animate={{ y: 0, opacity: 1, x: "-50%" }}
        transition={{ 
          duration: typeof window !== 'undefined' && window.innerWidth > 768 ? 1 : 0.5, 
          delay: 0.1, 
          ease: [0.22, 1, 0.36, 1] 
        }}
        className="fixed top-6 left-1/2 z-50 flex items-center justify-between md:justify-start h-14 px-8 rounded-full border border-white/10 bg-black/80 backdrop-blur-md w-[90%] max-w-[500px] md:w-auto md:max-w-none"
      >
        <div className="flex items-center gap-1 w-full md:w-auto justify-between md:justify-start">
          <div className="pl-4 pr-0 md:pr-6 text-white text-sm font-bold tracking-widest uppercase md:border-r md:border-white/10 whitespace-nowrap">
            Scale Forge
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isMatch = link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href.split('#')[0]) && link.href.split('#')[0] !== '/';

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:text-white/80 z-10 ${isMatch ? glowClass : link.strikethrough ? 'text-white/40 line-through decoration-white/20' : 'text-white/40'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center pl-4 pr-1 gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors pointer-events-auto flex items-center justify-center w-10 h-10"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
            <PremiumButton
              label="Book a Call"
              onClick={() => window.open('https://cal.com/scale-forge-guqonp/30min', '_blank')}
              className="scale-90"
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2 pr-2 pl-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors pointer-events-auto flex items-center justify-center w-10 h-10"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors pointer-events-auto"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center pt-20"
          >
            <div className="flex flex-col items-center gap-8 w-full px-6 pointer-events-auto">
              {navLinks.map((link) => {
                const isMatch = link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href.split('#')[0]) && link.href.split('#')[0] !== '/';

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-2xl font-bold tracking-[0.2em] relative uppercase transition-all duration-300 ${isMatch ? glowClass : 'text-white/40'
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="mt-8">
                <PremiumButton
                  label="Book a Call"
                  onClick={() => {
                    window.open('https://cal.com/scale-forge-guqonp/30min', '_blank');
                    setIsMobileMenuOpen(false);
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
