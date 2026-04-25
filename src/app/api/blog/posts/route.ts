import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { BlogPost } from '@/models/Blog'
import { verifyAuth } from '@/lib/auth'

// GET all posts (public: published only, admin: all)
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { authenticated } = await verifyAuth(request)
    const filter = authenticated ? {} : { published: true }

    const posts = await BlogPost.find(filter).sort({ publishedAt: -1, createdAt: -1 })
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Blog posts error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST create post (admin only)
export async function POST(request: NextRequest) {
  try {
    const { authenticated, user } = await verifyAuth(request)
    if (!authenticated || user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const body = await request.json()

    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Generate slug from title
    if (!body.slug) {
      body.slug = body.title
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    // Check slug uniqueness
    const existing = await BlogPost.findOne({ slug: body.slug })
    if (existing) {
      body.slug = `${body.slug}-${Date.now()}`
    }

    if (body.published && !body.publishedAt) {
      body.publishedAt = new Date()
    }

    const post = await BlogPost.create(body)
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Blog post creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
