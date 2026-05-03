import { sanityFetch } from "@/sanity/lib/live";
import { POST_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/components/PortableTextComponents";
import { notFound } from "next/navigation";
import ResultsCard from "@/components/ResultsCard";
import ContactSection from "../../../components/ContactSection";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { data: post } = await sanityFetch({
    query: POST_QUERY,
    params: { slug: resolvedParams.slug },
  });

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | ScaleForge`,
    description: post.description,
    openGraph: {
      images: post.coverImage?.asset?.url ? [post.coverImage.asset.url] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { data: post } = await sanityFetch({
    query: POST_QUERY,
    params: { slug: resolvedParams.slug },
  });

  if (!post) {
    notFound();
  }

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
    : "";

  const imageUrl = post.coverImage?.asset?.url
    ? urlFor(post.coverImage).width(1600).height(800).fit("crop").url()
    : "https://images.unsplash.com/photo-1674027326254-88c960d8e561?q=80&w=1632&auto=format&fit=crop";

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-blue-500/20 dark:selection:bg-orange-500/30 relative overflow-hidden">
      {/* 1. TITLE SECTION */}
      <section className="relative pt-32 pb-16 md:pt-36 md:pb-20 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/5 text-orange-500 text-[10px] font-bold uppercase tracking-widest mb-8">
            {post.category}
          </div>

          <h1 className="text-4xl md:text-7xl font-medium tracking-tight mb-8 leading-tight text-black dark:text-white">
            {post.title}
          </h1>

          <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40 mb-6">
            <span>{formattedDate}</span>
            <div className="w-1 h-1 rounded-full bg-orange-500" />
            <span>{post.readTime ?? 5} Min Read</span>
          </div>
        </div>
      </section>

      {/* 2. PICTURE SECTION */}
      <section className="w-full max-w-6xl mx-auto px-6 relative z-20 mb-20">
        <div className="w-full h-[400px] md:h-[600px] rounded-xl overflow-hidden border border-white/10 shadow-2xl relative">
          <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />
          <img
            src={imageUrl}
            alt={post.coverImage?.alt || post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 3. CONTENT SECTION */}
      <section className="py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto leading-relaxed font-light relative z-20">
            {/* Summary Block */}
            {post.description && (
              <div className="border-b border-black/10 dark:border-white/10 pb-16 mb-16">
                <h3 className="text-black dark:text-white font-medium text-2xl mb-6 flex items-center gap-4">
                  Executive Summary
                  <div className="flex-1 h-[1px] bg-black/10 dark:bg-white/10" />
                </h3>
                <p className="text-xl leading-relaxed italic border-l-2 pl-6 py-2 text-blue-600 dark:text-orange-500 border-blue-400 dark:border-orange-500/50">
                  {post.description}
                </p>
              </div>
            )}

            {/* Portable Text Body */}
            {post.body && (
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <PortableText value={post.body} components={portableTextComponents} />
              </div>
            )}

            {/* Manual fallback for ResultsCard if not in Sanity yet */}
            {resolvedParams.slug === 'seo-optimization' && !post.body?.some((block: any) => block._type === 'resultsCard') && (
              <ResultsCard />
            )}
          </div>
        </div>
      </section>

      <ContactSection />
    </main>
  );
}
