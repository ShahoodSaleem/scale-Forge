import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { POST_SLUGS_QUERY } from '@/sanity/lib/queries'

const BASE_URL = 'https://scaleforgewebdev.vercel.app'

// Static public-facing pages
const staticPages: MetadataRoute.Sitemap = [
  {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/services`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/projects`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/pricing`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/features`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/blogs`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/faq`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all published blog post slugs from Sanity
  let blogPages: MetadataRoute.Sitemap = []

  try {
    const posts = await client.fetch<{ slug: string; publishedAt?: string }[]>(
      POST_SLUGS_QUERY
    )

    blogPages = posts
      .filter((post) => post.slug)
      .map((post) => ({
        url: `${BASE_URL}/blogs/${post.slug}`,
        lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
        images: post.coverImage?.asset?.url ? [post.coverImage.asset.url] : [],
      }))
  } catch (error) {
    // Silently fail — sitemap will still include static pages
    console.error('[sitemap] Failed to fetch blog slugs:', error)
  }

  return [...staticPages, ...blogPages]
}
