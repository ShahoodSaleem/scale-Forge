import { sanityFetch } from "@/sanity/lib/live";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import BlogGrid from "./BlogGrid";
import ContactSection from "../../components/ContactSection";

export default async function BlogsPage() {
  const { data: posts } = await sanityFetch({ query: POSTS_QUERY });

  // Map Sanity posts to the format expected by BlogGrid
  const blogs = posts.map((post: any) => ({
    id: post._id,
    slug: post.slug,
    title: post.title,
    category: post.category,
    date: post.publishedAt
      ? new Date(post.publishedAt).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : "Coming Soon",
    readTime: post.readTime || 5,
    description: post.description,
    image: post.coverImage?.asset?.url || "https://images.unsplash.com/photo-1674027326254-88c960d8e561?q=80&w=1632&auto=format&fit=crop",
  }));

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-orange-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-36 md:pb-32 overflow-hidden border-b border-black/10 dark:border-white/10">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/5 text-orange-500 text-[10px] font-bold uppercase tracking-widest mb-8">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Writing & Deep Dives
            </div>

            <h1 className="text-5xl md:text-8xl font-medium tracking-tight mb-8 leading-tight text-black dark:text-white">
              Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 italic">Case Studies</span>
            </h1>
            <p className="text-lg md:text-xl text-black/50 dark:text-white/50 max-w-2xl mx-auto leading-relaxed">
              Explore our latest thoughts, operational strategies, and inside looks at how we help ambitious businesses scale using cutting-edge technology and premium design.
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Blogs Grid */}
      <BlogGrid blogs={blogs} />

      <ContactSection />
    </main>
  );
}
