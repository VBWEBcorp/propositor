import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { BlogPost } from '@/models/Blog'
import { verifyAuth } from '@/lib/auth'

type Params = Promise<{ slug: string }>

// GET single post by slug
export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const { slug } = await params
    await connectDB()

    const post = await BlogPost.findOne({ slug })
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Blog post error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT update post (admin only)
export async function PUT(request: NextRequest, { params }: { params: Params }) {
  try {
    const { authenticated, user } = await verifyAuth(request)
    if (!authenticated || user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params
    await connectDB()

    const body = await request.json()

    if (body.published && !body.publishedAt) {
      body.publishedAt = new Date()
    }

    const post = await BlogPost.findOneAndUpdate({ slug }, body, {
      new: true,
      runValidators: true,
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Blog post update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE post (admin only)
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    const { authenticated, user } = await verifyAuth(request)
    if (!authenticated || user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params
    await connectDB()

    const post = await BlogPost.findOneAndDelete({ slug })
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Post deleted' })
  } catch (error) {
    console.error('Blog post delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
