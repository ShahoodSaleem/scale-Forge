"use client";

import { motion } from 'framer-motion';

const PerfectShot = () => {
    return (
        <section className="relative w-[90%] mx-auto h-[250px] md:h-[600px] mb-40 flex flex-col items-center justify-center overflow-hidden mt-20">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/Assets/F1.avif')",
                }}
            >
                {/* Dark overlay to make text readable */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-white/80 text-sm md:text-base font-medium tracking-[0.3em] uppercase mb-6"
                >
                    Hire Us Now
                </motion.span>

                <motion.h2
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1,
                                delayChildren: 0.2
                            }
                        }
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-4xl md:text-7xl font-bold text-white mb-12 leading-[1.1] tracking-tight flex flex-wrap justify-center gap-x-[0.3em]"
                >
                    {"We Are Always Ready To Take A Perfect Shot".split(" ").map((word, index) => (
                        <motion.span
                            key={index}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="inline-block"
                        >
                            {word}
                        </motion.span>
                    ))}
                </motion.h2>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    whileHover={{ scale: 1.05, backgroundColor: '#ffffff' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.open('https://cal.com/scale-forge-guqonp/30min', '_blank')}
                    className="bg-white text-black px-12 py-5 rounded-full text-lg font-bold shadow-2xl hover:shadow-white/20 transition-all duration-300"
                >
                    Get Started
                </motion.button>
            </div>
        </section>
    );
};

export default PerfectShot;
