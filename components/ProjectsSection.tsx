"use client";

import { motion } from 'framer-motion';
import { ExternalLink, ArrowUpRight } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'Car Rental Website',
    description: 'Car Rental Website For Malaysian Client.',
    image: '/Assets/car.jpg',
  },
  {
    id: 2,
    title: 'Dental Clinic Website',
    description: 'Dental Website For Australian Client.',
    image: '/Assets/teeth.jpg',
  },
  {
    id: 3,
    title: 'Jewellery Store Website',
    description: 'Premium Jewellery E-commerce Store.',
    image: '/Assets/Jewellery.jpg',
  },
  {
    id: 4,
    title: 'E-Commerce Website',
    description: 'E commerce Website Mockup For Future Client Inspiration.',
    image: '/Assets/Ecommerce.jpg',
  },
];

const ProjectCard = ({ project, index }: { project: any, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group relative h-[550px] w-full block overflow-hidden rounded-3xl border border-orange-300/10 bg-[#ffffff]/5 backdrop-blur-sm"
    >
      {/* Background Image with Hover Zoom */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-115"
        style={{ backgroundImage: `url(${project.image})` }}
      />

      {/* Dynamic Overlay - Color Burn/Multiply Effect */}
      <div className="absolute inset-0 bg-[#000000]/20 dark:bg-[#000000]/70 transition-colors duration-500 group-hover:bg-[#000000]/10 dark:group-hover:bg-[#000000]/50" />

      {/* Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent opacity-80" />

      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
          <div className="flex items-center gap-2 text-orange-500 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="text-xs font-bold uppercase tracking-widest">Featured Project</span>
            <div className="h-[1px] w-8 bg-orange-500" />
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-[#ffffff] mb-3 group-hover:text-orange-500 transition-colors duration-500">
            {project.title}
          </h3>

          <p className="text-[#ffffff]/60 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {project.description}
          </p>
        </div>
      </div>

      {/* Subtle Border Glow */}
      <div className="absolute inset-0 border border-[#ffffff]/0 transition-colors duration-500 group-hover:border-[#ffffff]/10 rounded-3xl pointer-events-none" />
    </motion.div>
  );
};

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24 px-6 bg-black">
      <div className="max-w-[1580px] mx-auto">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div className="max-w-xl">
            <motion.span
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-4 block"
            >
              Selected Work
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6"
            >
              Building the next generation of <br /> high-performing businesses.
            </motion.h2>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

import Link from 'next/link';
export default ProjectsSection;
