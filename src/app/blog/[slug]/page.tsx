import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { connectDB } from '@/lib/db'
import { BlogPost } from '@/models/Blog'
import { siteConfig } from '@/lib/seo'
import BlogPostContent from './blog-post-content'

type Params = Promise<{ slug: string }>

// Revalidate every 60 minutes — new articles will be picked up automatically
export const revalidate = 3600

// Pre-render all published blog posts at build time
export async function generateStaticParams() {
  try {
    await connectDB()
    const posts = await BlogPost.find({ published: true }).select('slug').lean()
    return posts.map((post) => ({ slug: (post as any).slug }))
  } catch {
    return []
  }
}

// Generate SEO metadata server-side — visible to Google on first crawl
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params

  try {
    await connectDB()
    const post = await BlogPost.findOne({ slug, published: true }).lean() as any

    if (!post) return {}

    const title = post.metaTitle || post.title
    const description = (post.metaDescription || post.excerpt || '').substring(0, 160)
    const url = `${siteConfig.url}/blog/${post.slug}`

    return {
      title,
      description,
      authors: post.author ? [{ name: post.author }] : [],
      openGraph: {
        type: 'article',
        title,
        description,
        url,
        siteName: siteConfig.name,
        locale: siteConfig.locale,
        images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630, alt: title }] : [],
        publishedTime: post.publishedAt?.toISOString(),
        modifiedTime: post.updatedAt?.toISOString(),
        authors: post.author ? [post.author] : [],
        tags: post.tags || [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: post.coverImage ? [post.coverImage] : [],
      },
      alternates: {
        canonical: `/blog/${post.slug}`,
      },
    }
  } catch {
    return {}
  }
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params

  // Server-side check: if post doesn't exist or isn't published, 404
  try {
    await connectDB()
    const post = await BlogPost.findOne({ slug, published: true }).lean() as any

    if (!post) notFound()

    // Render JSON-LD server-side for structured data
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      image: post.coverImage || undefined,
      datePublished: post.publishedAt?.toISOString(),
      dateModified: post.updatedAt?.toISOString(),
      author: post.author ? { '@type': 'Person', name: post.author } : undefined,
      publisher: {
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteConfig.url,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${siteConfig.url}/blog/${post.slug}`,
      },
      keywords: post.tags?.join(', '),
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <BlogPostContent slug={slug} />
      </>
    )
  } catch {
    notFound()
  }
}
