import { sanityFetch } from "@/sanity/lib/live";
import { POST_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/components/PortableTextComponents";
import { notFound } from "next/navigation";
import Image from "next/image";
import ResultsCard from "@/components/ResultsCard";
import ContactSection from "../../../components/ContactSection";
import type { Metadata } from "next";
import { SanityDocument } from "next-sanity";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Post extends SanityDocument {
  title: string;
  description?: string;
  category?: string;
  publishedAt?: string;
  readTime?: number;
  coverImage?: {
    asset?: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  body?: any[];
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { data: post } = (await sanityFetch({
    query: POST_QUERY,
    params: { slug: resolvedParams.slug },
  })) as { data: Post | null };

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
  const { data: post } = (await sanityFetch({
    query: POST_QUERY,
    params: { slug: resolvedParams.slug },
  })) as { data: Post | null };

  if (!post) {
    notFound();
  }

  const year = post.publishedAt ? new Date(post.publishedAt).getFullYear() : "2024";

  const imageUrl = post.coverImage?.asset?.url
    ? urlFor(post.coverImage).width(1920).height(1080).fit("crop").url()
    : "https://images.unsplash.com/photo-1674027326254-88c960d8e561?q=80&w=1632&auto=format&fit=crop";

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-blue-500/20 dark:selection:bg-orange-500/30 relative">
      {/* 1. HERO SECTION (Mobile Optimized) */}
      <section className="relative w-full h-[100vh] min-h-[600px] overflow-hidden">
        {/* Background Image */}
        <Image
          src={imageUrl}
          alt={post.coverImage?.alt || post.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority={true}
          loading="eager"
        />
        
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-black/2 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />

        {/* Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end pb-12 md:pb-32">
          <div className="max-w-[1920px] mx-auto w-full px-6 md:px-16 lg:px-24">
            
            {/* Back Link - Shifted down on mobile to clear fixed navbar */}
            <Link 
              href="/blogs" 
              className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-[10px] font-medium uppercase tracking-[0.2em] mb-8 md:mb-12 group mt-20 md:mt-0"
            >
              <ArrowLeft className="w-3 h-3" />
              All Work
            </Link>

            {/* Metadata (Label) */}
            <div className="flex items-center gap-3 text-orange-600 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.1em] mb-4">
              <span>{post.category}</span>
              <span className="text-white/20">—</span>
              <span className="text-white/40">{year}</span>
            </div>

            {/* Main Heading (Responsive Font Size) */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] max-w-5xl mb-6 md:mb-10">
              {post.title}
            </h1>

            {/* Subtext (Responsive Font Size) */}
            {post.description && (
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/60 max-w-3xl leading-relaxed font-light">
                {post.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 2. CONTENT SECTION (Mobile Optimized Width) */}
      <section className="py-16 md:py-32 relative z-20">
        <div className="max-w-[1920px] mx-auto px-6 md:px-16 lg:px-24">
          <div className="w-full">
            {/* Portable Text Body */}
            {post.body && (
              <div className="prose prose-sm sm:prose-base md:prose-lg lg:prose-xl dark:prose-invert max-w-none 
                prose-headings:text-cyan-600 dark:prose-headings:text-orange-500
                prose-p:text-black/80 dark:prose-p:text-white/70 prose-p:font-light prose-p:leading-relaxed
                prose-strong:text-black dark:prose-strong:text-white
                prose-a:text-orange-500 hover:prose-a:text-orange-400
                prose-img:rounded-2xl md:prose-img:rounded-3xl prose-img:border prose-img:border-black/5 dark:prose-img:border-white/10"
              >
                <PortableText value={post.body} components={portableTextComponents} />
              </div>
            )}

            {/* ResultsCard Integration */}
            {resolvedParams.slug === 'seo-optimization' && !post.body?.some((block: any) => block._type === 'resultsCard') && (
              <div className="mt-16 md:mt-24">
                <ResultsCard />
              </div>
            )}
          </div>
        </div>
      </section>

      <ContactSection />
    </main>
  );
}
