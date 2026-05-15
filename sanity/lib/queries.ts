import { defineQuery } from 'next-sanity'

// All posts for the listing page
export const POSTS_QUERY = defineQuery(`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    publishedAt,
    readTime,
    description,
    coverImage {
      asset->{ _id, url },
      alt,
      hotspot,
      crop
    }
  }
`)

// Single post by slug
export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    category,
    publishedAt,
    readTime,
    description,
    coverImage {
      asset->{ _id, url },
      alt,
      hotspot,
      crop
    },
    body
  }
`)

// All slugs for static generation
export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post"] { 
    "slug": slug.current,
    publishedAt,
    coverImage {
      asset->{ url }
    }
  }
`)
