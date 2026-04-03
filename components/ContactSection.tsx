"use client";

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { sendEmail } from '../app/actions/sendEmail';

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const formData = new FormData(event.currentTarget);
    const result = await sendEmail(formData);

    if (result.error) {
      setStatus({ type: 'error', message: result.error });
    } else {
      setStatus({ type: 'success', message: 'Message sent successfully!' });
      (event.target as HTMLFormElement).reset();
    }
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="relative py-24 pb-12 bg-black overflow-hidden">
      {/* Background Map Illustration (SVG Pattern) */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%" className="w-full h-full text-white/5">
          <pattern id="map-pattern" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
            {/* Minimalist grid/circuit inspired by the map image */}
            <path d="M50 50 L150 50 L150 150 L50 150 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M200 100 L300 100 L300 250 L200 250 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M50 250 L120 250 L120 350 L50 350 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M0 200 Q100 180 200 220 T400 200" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M100 0 Q120 150 80 300 T100 400" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="250" cy="150" r="1.5" fill="currentColor" opacity="0.3" />
            <circle cx="100" cy="200" r="1.5" fill="currentColor" opacity="0.3" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#map-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Side: Contact Info */}
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-6xl md:text-8xl font-medium tracking-tight text-white mb-16"
            >
              Contact us
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-auto pt-16 border-t border-white/10 uppercase italic">
              <div>
                <h3 className="text-white/30 text-[11px] font-bold uppercase tracking-[0.3em] mb-6">Our Address</h3>
                <address className="not-italic text-white/50 text-base leading-relaxed space-y-1">
                  <p>Noorabad Colony</p>
                  <p>Gulshan E Iqbal Block 14/A</p>
                  <p>Karachi, Pakistan</p>
                </address>
              </div>

              <div>
                <h3 className="text-white/30 text-[11px] font-bold uppercase tracking-[0.3em] mb-6">Our Contacts</h3>
                <div className="text-white/50 text-base leading-relaxed space-y-2">
                  <a href="mailto:scaleforge.sales@gmail.com" className="block hover:text-white transition-colors">scaleforge.sales@gmail.com</a>
                  <a href="tel:+923363791538" className="block hover:text-white transition-colors">+92 336 3791 538</a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Feedback Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#111111] border border-white/10 rounded-none p-10 lg:p-14 shadow-2xl relative"
          >
            <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-12">Feedback Form</h3>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="relative border-b border-white/10 focus-within:border-orange-500 transition-colors py-2 group">
                <label className="block text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full bg-transparent text-white text-lg outline-none py-1 placeholder:text-white/10"
                  placeholder="Your Name"
                />
              </div>

              <div className="relative border-b border-white/10 focus-within:border-orange-500 transition-colors py-2 group">
                <label className="block text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">E-mail</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full bg-transparent text-white text-lg outline-none py-1 placeholder:text-white/10"
                  placeholder="hello@example.com"
                />
              </div>

              <div className="relative border-b border-white/10 focus-within:border-orange-500 transition-colors py-2 group">
                <label className="block text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  className="w-full bg-transparent text-white text-lg outline-none py-1 placeholder:text-white/10"
                  placeholder="+....."
                />
              </div>

              <div className="relative border-b border-white/10 focus-within:border-orange-500 transition-colors py-2 group">
                <label className="block text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Message</label>
                <textarea
                  name="message"
                  rows={2}
                  required
                  className="w-full bg-transparent text-white text-lg outline-none py-1 resize-none placeholder:text-white/10"
                  placeholder="How can we help?"
                />
              </div>

              {status && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 flex items-center gap-3 text-sm ${
                    status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {status.message}
                </motion.div>
              )}

              <div className="pt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white text-black px-10 py-5 rounded-none flex items-center justify-between gap-4 hover:bg-white/90 disabled:bg-white/50 disabled:cursor-not-allowed transition-all uppercase text-[11px] font-bold tracking-widest group w-full"
                >
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  {!isSubmitting && <div className="h-[1px] w-8 bg-black/40 group-hover:w-16 transition-all" />}
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Footer Bar */}
        <div className="mt-24 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <a
              href="https://www.instagram.com/scale_forge.pk?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all bg-white/5"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.linkedin.com/company/109758860/admin/dashboard/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all bg-white/5"
            >
              <LinkedinIcon />
            </a>
          </div>

          <div className="flex items-center gap-4 text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">
            <span>Follow us</span>
            <div className="h-[2px] w-8 bg-white/20" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
