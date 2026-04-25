import type { MetadataRoute } from 'next'

import { siteConfig } from '@/lib/seo'
import { connectDB } from '@/lib/db'
import { BlogPost, BlogSettings } from '@/models/Blog'
import { GallerySettings } from '@/models/Gallery'

const baseUrl = siteConfig.url

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/a-propos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  try {
    await connectDB()

    // Gallery page if enabled
    const gallerySettings = await GallerySettings.findOne()
    if (gallerySettings?.enabled) {
      pages.push({
        url: `${baseUrl}/gallery`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }

    // Blog pages if enabled
    const blogSettings = await BlogSettings.findOne()
    if (blogSettings?.enabled) {
      pages.push({
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })

      // Individual blog posts
      const posts = await BlogPost.find({ published: true }).select('slug updatedAt publishedAt')
      for (const post of posts) {
        pages.push({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updatedAt || post.publishedAt),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }
    }
  } catch (error) {
    console.error('Sitemap generation error:', error)
  }

  return pages
}
