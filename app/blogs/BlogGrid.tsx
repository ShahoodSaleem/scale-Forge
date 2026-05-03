"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type Blog = {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: number;
  description: string;
  image: string;
};

const BlogCard = ({ blog }: { blog: Blog }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springX = useSpring(mouseX, { stiffness: 150, damping: 40 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 40 });

  useEffect(() => {
    if (window.innerWidth <= 768) {
      mouseX.set(200);
      mouseY.set(200);
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || window.innerWidth <= 768) return;
      const rect = cardRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="h-full blob-card group"
    >
      <div className="blob-bg" />
      <motion.div
        className="blob-element transition-opacity duration-1000 opacity-0 group-hover:opacity-60"
        style={{ x: springX, y: springY, top: 0, left: 0, marginLeft: "-125px", marginTop: "-125px" }}
      />

      <Link
        href={`/blogs/${blog.slug}`}
        className="relative z-10 flex flex-col h-full cursor-pointer"
        onClick={() => console.log('Navigating to', `/blogs/${blog.slug}`)}
      >
        <div className="h-full flex flex-col pointer-events-none">
          {/* Image */}
          <div className="relative h-[200px] w-full overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-transparent transition-colors duration-500" />
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute top-4 left-4 z-20">
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 text-white/80 text-[9px] font-bold uppercase tracking-wider">
                {blog.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 relative flex-1 flex flex-col">
            <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40 mb-4">
              <span>{blog.date}</span>
              <div className="w-1 h-1 rounded-full bg-orange-500" />
              <span>{blog.readTime} Min Read</span>
            </div>

            <h3 className="text-xl font-bold text-black dark:text-white mb-2 line-clamp-2">
              {blog.title}
            </h3>
            <p className="text-sm text-black/60 dark:text-white/60 line-clamp-2">
              {blog.description}
            </p>

            <div className="flex items-center pt-6 border-t border-black/10 dark:border-white/10 gap-2 text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em] group-hover:gap-4 transition-all duration-300 mt-auto">
              <span>Read Article</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default function BlogGrid({ blogs }: { blogs: Blog[] }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const existingCategories = Array.from(new Set(blogs.map((b) => b.category)));
  const filters = ["All", ...existingCategories];

  const filteredBlogs = activeFilter === "All"
    ? blogs
    : blogs.filter((b) => b.category === activeFilter);

  return (
    <>
      <style>{`
        .blob-card {
          position: relative; z-index: 10; overflow: hidden;
          display: flex; flex-direction: column;
          background: #f5f5f5;
          border: 1px solid rgba(0,0,0,0.08);
          transition: border-color 0.5s;
        }
        .blob-card:hover { border-color: rgba(59,130,246,0.6); }
        :is(.dark) .blob-card:hover { border-color: rgba(249,115,22,0.5); }
        .blob-bg {
          position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 2;
          background: rgba(245,245,245,0.97); backdrop-filter: blur(24px); pointer-events: none;
        }
        .blob-element {
          position: absolute; z-index: 1; width: 250px; height: 250px;
          border-radius: 50%; background-color: #ea580c;
          filter: blur(40px); pointer-events: none;
        }
        :is(.dark) .blob-card { background: #111111; border: 1px solid rgba(255,255,255,0.1); }
        :is(.dark) .blob-bg { background: rgba(17,17,17,0.95); }
      `}</style>

      <section className="py-24 bg-white dark:bg-black relative">
        <div className="max-w-7xl mx-auto px-6">
          {/* Filter bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            {filters.map((filter) => (
              <button
                key={filter}
                id={`filter-${filter.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${activeFilter === filter
                    ? "bg-orange-500 border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                    : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:border-black/30 dark:hover:border-white/30"
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {blogs.length === 0 ? (
            <div className="text-center py-24 text-black/30 dark:text-white/30">
              <p className="text-2xl font-medium mb-2">No posts yet</p>
              <p className="text-sm">Check back soon — or add posts in the Sanity Studio at <span className="text-orange-500">/studio</span></p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredBlogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
