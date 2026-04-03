"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQItem = ({ question, answer, index }: { question: string, answer: string, index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any, delay: index * 0.1 }
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      className={`border border-white/10 bg-white/5 overflow-hidden transition-all duration-300 ${isOpen ? 'bg-white/10 border-white/20' : 'hover:bg-white/[0.07]'}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-center justify-between gap-4"
      >
        <span className="text-lg md:text-xl font-medium tracking-tight text-white/90">
          {question}
        </span>
        <div className={`w-20 h-12 rounded-full flex items-center justify-center border border-white/10 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-white text-black' : 'text-white/60'}`}>
          {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }}
          >
            <div className="px-6 pb-8 text-white/60 text-base leading-relaxed max-w-3xl">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: "How do I get started with Scale Forge?",
      answer: "Getting started is simple. Just click the 'Book A Call' button at the top, and we'll walk you through a brief discovery session to understand your business goals and tailor our services accordingly."
    },
    {
      question: "What industries do you specialize in?",
      answer: "We focus on technology, finance, healthcare, SaaS and e-commerce businesses. Our strategies are designed to scale complex offerings into clear, high-conversion market leaders regardless of the industry."
    },
    {
      question: "How long does a typical project take?",
      answer: "A standard brand or web overhaul typically takes 6-10 weeks. However, we also offer 'Sprint' cycles for faster deliverables without compromising on the high-fidelity quality we're known for."
    },
    {
      question: "Do you offer post-launch support?",
      answer: "Absolutely. We provide comprehensive analytics tracking, A/B testing, and strategy refinement for 3 months following every major deployment to ensure your growth remains steady."
    }
  ];

  return (
    <section id="faq" className="py-40 px-6 bg-black">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-bold text-white/30 tracking-[0.3em] uppercase mb-4 block"
          >
            Common Questions
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-medium tracking-tight text-white font-heading"
          >
            Frequently Asked Questions
          </motion.h2>
        </div>

        {/* FAQ List */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-4"
        >
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              index={i}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
