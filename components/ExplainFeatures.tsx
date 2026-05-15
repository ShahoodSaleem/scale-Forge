"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import {
    Search, Layout, Palette, FileText, Zap, BarChart3, Target
} from 'lucide-react';

const features = [
    {
        title: 'SEO Optimization',
        icon: Search,
        description: 'We boost your search rankings with data-driven keyword strategies and thorough technical audits to ensure your brand reaches the right audience. Our approach focuses on both on-page excellence and high-quality backlink profiles to dominate search results.',
        details: ['Keyword Strategy', 'Technical Audits', 'Backlink Profile'],
        metric: '1.2M+ Reach',
        image: '/Assets/ExplainingFeatures/SEO.avif'
    },
    {
        title: 'Web Design',
        icon: Layout,
        description: 'High-conversion, premium interfaces designed to wow your customers and drive growth. We focus on interaction design and custom UI/UX that tells your brand story while ensuring a seamless journey for every visitor.',
        details: ['Custom UI/UX', 'Component Library', 'Interaction Design'],
        metric: '+65% Engagement',
        image: '/Assets/ExplainingFeatures/Code.avif'
    },
    {
        title: 'Branding',
        icon: Palette,
        description: 'Define your identity with unique visual systems and compelling brand storytelling. We create cohesive brand voices and asset guidelines that ensure your identity remains consistent and recognizable across all platforms.',
        details: ['Visual Identity', 'Brand Voice', 'Asset Guidelines'],
        metric: '100% Unique',
        image: '/Assets/ExplainingFeatures/Brand.avif'
    },
    {
        title: 'Content Strategy',
        icon: FileText,
        description: 'Engaging, high-quality content that resonates with your audience and builds authority. Our growth roadmaps and media planning ensure that every piece of content serves a purpose in your overall marketing strategy.',
        details: ['Copywriting', 'Growth Roadmap', 'Media Planning'],
        metric: 'High Authority',
        image: '/Assets/ExplainingFeatures/Content.avif'
    },
    {
        title: 'Performance',
        icon: Zap,
        description: 'Lightning-fast page speeds and core web vitals optimization for better UX. We optimize Largest Contentful Paint (LCP) and focus on sub-second load times to reduce bounce rates and improve user retention.',
        details: ['Core Web Vitals', '0.4s Fast Load', 'LCP Optimization'],
        metric: '99+ Score',
        image: '/Assets/ExplainingFeatures/Speed.avif'
    },
    {
        title: 'Analytics',
        icon: BarChart3,
        description: 'Deep-dive tracking and behavior analysis to optimize your conversion funnel. We provide ROI reporting and behavior analysis to turn data into actionable insights that fuel your business growth.',
        details: ['Funnel Tracking', 'Behavior Analysis', 'ROI Reporting'],
        metric: 'Data-Driven',
        image: '/Assets/ExplainingFeatures/Analytics.avif'
    },
    {
        title: 'Digital Strategy',
        icon: Target,
        description: 'Comprehensive roadmaps designed to scale your business in the modern digital landscape. From market analysis to scalability audits, we build the foundation for long-term digital success and expansion.',
        details: ['Market Analysis', 'Scalability Audits', 'Growth Maps'],
        metric: 'Scaled Growth',
        image: '/Assets/ExplainingFeatures/DS.avif'
    },
];

const FeatureDetail = ({ title, icon: Icon, description, details, metric, index, image }: any) => {
    const isEven = index % 2 === 0;
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-32 md:mb-48 last:mb-0"
        >
            <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-20 items-center`}>
                <div className="flex-1 space-y-8 text-left">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight">{title}</h3>
                        </div>
                        <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-xl">
                            {description}
                        </p>
                    </div>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                        {details.map((detail: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-3 text-white/80 font-medium">
                                <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_color-mix(in_srgb,var(--color-orange-500)_50%,transparent)]" />
                                {detail}
                            </li>
                        ))}
                    </ul>

                    <div className="pt-4">
                        <div className="inline-flex flex-col p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Impact Metric</span>
                            <span className="text-2xl font-bold text-white">{metric}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full relative group">
                    <div className="absolute -inset-4 bg-orange-500/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10">
                        <Image
                            src={image}
                            alt={title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ExplainFeatures = () => {
    return (
        <section id="explain-features" className="bg-black py-24 md:py-40 px-6">
            <div className="max-w-[1440px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-32 text-left"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 font-semibold uppercase tracking-[0.2em] text-xs mb-8">
                        The Scale Forge Advantage
                    </span>
                    <h2 className="text-5xl md:text-8xl font-bold text-white mb-10 leading-[1] tracking-tighter">
                        Here Is What <br className="hidden md:block" /> We Do <span className="text-orange-500">Best.</span>
                    </h2>
                    <p className="text-white/50 text-xl md:text-2xl max-w-3xl leading-relaxed font-light">
                        We combine cutting-edge technology with strategic thinking to engineer growth for ambitious brands. Explore our core pillars of excellence.
                    </p>
                </motion.div>

                <div className="space-y-40 md:space-y-64">
                    {features.map((feature, idx) => (
                        <FeatureDetail key={idx} {...feature} index={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ExplainFeatures;
