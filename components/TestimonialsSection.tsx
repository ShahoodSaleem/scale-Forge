"use client";

import { motion } from "framer-motion";

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('');
};

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "CEO, TechFlow",
    title: "Transformed our online presence and tripled leads",
    text: "Scale Forge completely transformed our online presence. Within just three months of launch, our lead volume tripled and bounce rate dropped by 40%. The new website design perfectly captures our brand identity and converts visitors into paying clients at a rate we never thought possible."
  },
  {
    name: "Mark Roberts",
    role: "Founder, GrowthPeak",
    title: "A game-changer that improved rankings and site speed",
    text: "Working with Scale Forge was a game-changer for our business. They delivered a high-performance Next.js site that significantly improved our search rankings and cut page load times from 6 seconds to under 1.2 seconds. The SEO strategy they implemented resulted in a 215% increase in organic traffic."
  },
  {
    name: "Elena Rodriguez",
    role: "Marketing Director, Horizon Realty",
    title: "Exceeded expectations with stunning, conversion-focused design",
    text: "The Scale Forge team exceeded our expectations at every stage of the project. Their strategic approach to technical SEO combined with stunning, conversion-focused UI design helped us dominate our local market within months of going live. We went from page 4 to the top 3 results for our primary keywords."
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
            className="text-sm font-medium text-white mb-4"
          >
            Testimonial
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6"
          >
            <span className="text-orange-500">Customer</span> Success Stories
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
              className="p-8 md:p-10 border border-white/5 bg-black rounded-3xl flex flex-col justify-between shadow-2xl shadow-black/10"
            >
              <div>
                {/* Quote Icon */}
                <svg className="w-10 h-10 text-orange-500 mb-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                <h3 className="text-xl md:text-2xl font-semibold text-white mb-6 pr-4 leading-snug">
                  {testimonial.title}
                </h3>

                <p className="text-white/70 text-sm md:text-base leading-relaxed mb-10 font-light">
                  {testimonial.text}
                </p>
              </div>

              <div>
                <div className="w-full h-px bg-white/10 mb-8"></div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                      {getInitials(testimonial.name)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">{testimonial.name}</span>
                      <span className="text-xs text-white/60">{testimonial.role}</span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, s) => (
                      <svg key={s} className="w-4 h-4 text-orange-500 fill-orange-500" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
