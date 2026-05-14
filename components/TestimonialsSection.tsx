"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "CEO, TechFlow",
    text: "Scale Forge completely transformed our online presence. Our lead volume has tripled, and the new website design perfectly captures our brand identity. Truly exceptional work."
  },
  {
    name: "Mark Roberts",
    role: "Founder, GrowthPeak",
    text: "Working with Scale Forge was a game-changer. They delivered a high-performance Next.js site that significantly improved our search rankings and load times. Highly recommend!"
  },
  {
    name: "Elena Rodriguez",
    role: "Marketing Director, Horizon Realty",
    text: "The Scale Forge team exceeded our expectations. Their strategic approach to SEO and stunning UI design helped us dominate our local market within months."
  }
];

export default function TestimonialsSection() {
  return (
    <section className="bg-black py-24 px-6 md:px-12 w-full relative">
      <div className="max-w-[1450px] mx-auto flex flex-col gap-16">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-[10px] font-bold text-orange-500 tracking-[0.2em] uppercase mb-8"
          >
            Client Success
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6"
          >
            Don't Just Take Our Word For It.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-8 border border-white/10 bg-white/5 rounded-2xl flex flex-col justify-between"
            >
              <p className="text-white/70 italic mb-8 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div>
                <div className="text-white font-bold">{testimonial.name}</div>
                <div className="text-orange-500 text-sm mt-1">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
