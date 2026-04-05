"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import ContactSection from "../../components/ContactSection";

// Only Use The Category as: "Case Studies", "Blogs", "Articles", "Testing"

const blogs = [
  // {
  //   id: 1,
  //   slug: "how-we-scaled-ecommerce",
  //   title: "How We Scaled This Brand's Visitors by 300%",
  //   category: "Case Studies",
  //   date: "Mar 2026",
  //   image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
  //   description: "Discover the strategies and implementations we used to triple the revenue of a leading e-commerce brand through state-of-the-art UX optimizations."
  // },
  // {
  //   id: 2,
  //   slug: "future-of-web-dev-2026",
  //   title: "The Future of Web Development & SEO in 2026",
  //   category: "Blogs",
  //   date: "Feb 2026",
  //   image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
  //   description: "Explore the cutting-edge technologies shaping the next generation of web experiences, from AI integrations to seamless interactive animations."
  // },
  // {
  //   id: 3,
  //   slug: "custom-crm-enterprise",
  //   title: "What Looks Good vs What Sells",
  //   category: "Case Studies",
  //   date: "Jan 2026",
  //   image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
  //   description: "How a custom CRM streamlined operations, reduced friction, and saved 40 hours per week for our leading enterprise client."
  // },
  // {
  //   id: 4,
  //   slug: "design-conversion-rates",
  //   title: "Why Design Matters for Conversion Rates",
  //   category: "Articles",
  //   date: "Dec 2025",
  //   image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
  //   description: "An in-depth look at how UI/UX improvements, aesthetics, and user psychology directly impact your bottom line and user retention."
  // },
  {
    id: 1,
    slug: "zero-organic-traction-to-page-one-dominance",
    title: "Zero Organic Traction to Page-One Dominance",
    category: "Case Studies",
    date: "April 2026",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1596&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "How a regional real estate firm tripled qualified lead volume in 9 months."
  }
  //Jo bhi Article likha ha, uper se aak section copy karoo nechay, name change karoo aur phir blogs me new floder bana kr likhdo//

];


export default function BlogsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const existingCategories = Array.from(new Set(blogs.map(b => b.category)));
  const filters = ["All", ...existingCategories];

  const filteredBlogs = blogs.filter((blog) => {
    if (activeFilter === "All") return true;
    return blog.category === activeFilter;
  });

  return (
    <main className="min-h-screen bg-black text-white selection:bg-orange-500/30">
      {/* Custom Subpage Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-24 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="text-white text-xl font-bold tracking-widest uppercase">
          Scale Forge
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 text-white/60 hover:text-orange-500 transition-colors uppercase tracking-[0.2em] text-[10px] font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-orange-500/50"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 overflow-hidden border-b border-white/10">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/5 text-orange-500 text-[10px] font-bold uppercase tracking-widest mb-8">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Writing & Deep Dives
            </div>

            <h1 className="text-5xl md:text-8xl font-medium tracking-tight mb-8 leading-tight">
              Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 italic">Case Studies</span>
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              Explore our latest thoughts, operational strategies, and inside looks at how we help ambitious businesses scale using cutting-edge technology and premium design.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="py-24 bg-black relative">
        <div className="max-w-7xl mx-auto px-6">
          {/* Filter Navbar */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${activeFilter === filter
                  ? "bg-orange-500 border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                  : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/30"
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredBlogs.map((blog, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={blog.id}
                  className="h-full"
                >
                  <Link href={`/blogs/${blog.slug}`} className="group h-full relative bg-[#111111] border border-white/10 rounded-none overflow-hidden hover:border-orange-500/50 transition-colors duration-500 cursor-pointer flex flex-col">
                    <div className="h-full flex flex-col">
                      {/* Image Container */}
                      <div className="relative h-[200px] w-full overflow-hidden shrink-0">
                        <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-transparent transition-colors duration-500" />
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
                        />

                        {/* Category Tag */}
                        <div className="absolute top-4 left-4 z-20">
                          <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 text-white/80 text-[9px] font-bold uppercase tracking-wider">
                            {blog.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 md:p-8 relative flex-1 flex flex-col">
                        <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-wider text-white/40 mb-4">
                          <span>{blog.date}</span>
                          <div className="w-1 h-1 rounded-full bg-orange-500" />
                          <span>5 Min Read</span>
                        </div>

                        <h3 className="text-xl font-medium mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-orange-500 transition-all duration-300">
                          {blog.title}
                        </h3>

                        <p className="text-white/50 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                          {blog.description}
                        </p>

                        <div className="flex items-center pt-6 border-t border-white/10 gap-2 text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em] group-hover:gap-4 transition-all duration-300 mt-auto">
                          <span>Read Article</span>
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <ContactSection />
    </main>
  );
}
