import { MetadataRoute } from 'next'

const BASE_URL = 'https://scaleforgewebdev.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all bots on public pages
        userAgent: '*',
        allow: '/',
        disallow: [
          '/portal/',
          '/portal/admin/',
          '/portal/employee/',
          '/studio/',
          '/api/',
          '/_next/',
          '/static/',
        ],
      },
      {
        // Block GPTBot (OpenAI scraper) from all content
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        // Block CCBot (Common Crawl used for AI training)
        userAgent: 'CCBot',
        disallow: '/',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
