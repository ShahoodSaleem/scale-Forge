import { MetadataRoute } from 'next'

const BASE_URL = 'https://scaleforgewebdev.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/portal',
          '/portal/*',
          '/studio',
          '/studio/*',
          '/api',
          '/api/*',
          '/_next',
          '/_next/*',
        ],
      },
      {
        // Block GPTBot (OpenAI)
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        // Block CCBot (Common Crawl)
        userAgent: 'CCBot',
        disallow: '/',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
