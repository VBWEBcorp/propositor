import type { Metadata } from 'next'

import { connectDB } from '@/lib/db'
import { BlogSettings, BlogPost } from '@/models/Blog'
import { siteConfig } from '@/lib/seo'
import BlogPageContent from './blog-page-content'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  try {
    await connectDB()
    const settings = await BlogSettings.findOne().lean() as any

    const title = settings?.title || 'Blog'
    const description = settings?.description || 'Découvrez nos articles, conseils et actualités.'

    return {
      title,
      description,
      openGraph: {
        type: 'website',
        title,
        description,
        url: `${siteConfig.url}/blog`,
        siteName: siteConfig.name,
        locale: siteConfig.locale,
        images: settings?.heroImage ? [{ url: settings.heroImage }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: settings?.heroImage ? [settings.heroImage] : [],
      },
      alternates: {
        canonical: '/blog',
      },
    }
  } catch {
    return { title: 'Blog' }
  }
}

export default async function BlogPage() {
  // Pre-fetch posts for JSON-LD CollectionPage structured data
  let jsonLd = null
  try {
    await connectDB()
    const settings = await BlogSettings.findOne().lean() as any
    const posts = await BlogPost.find({ published: true })
      .sort({ publishedAt: -1 })
      .select('title slug excerpt coverImage publishedAt author')
      .limit(20)
      .lean() as any[]

    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: settings?.title || 'Blog',
      description: settings?.description || 'Nos dernières actualités',
      url: `${siteConfig.url}/blog`,
      publisher: {
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteConfig.url,
      },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: posts.map((post, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${siteConfig.url}/blog/${post.slug}`,
          name: post.title,
        })),
      },
    }
  } catch {
    // Silently fail
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <BlogPageContent />
    </>
  )
}
