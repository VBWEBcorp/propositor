import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { GalleryImage } from '@/models/Gallery'
import { verifyAuth } from '@/lib/auth'
import { Types } from 'mongoose'

type Params = Promise<{ id: string }>

// GET single image (admin - all, public - active only)
export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params
    await connectDB()

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const image = await GalleryImage.findById(id)
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    return NextResponse.json(image)
  } catch (error) {
    console.error('Gallery image error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT update image (admin only)
export async function PUT(request: NextRequest, { params }: { params: Params }) {
  try {
    const { authenticated, user } = await verifyAuth(request)
    if (!authenticated || user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await connectDB()

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const { title, description, imageUrl, category, order, active } = await request.json()

    const image = await GalleryImage.findByIdAndUpdate(
      id,
      { title, description, imageUrl, category, order, active },
      { new: true, runValidators: true }
    )

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    return NextResponse.json(image)
  } catch (error) {
    console.error('Gallery image update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE image (admin only)
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    const { authenticated, user } = await verifyAuth(request)
    if (!authenticated || user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await connectDB()

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const image = await GalleryImage.findByIdAndDelete(id)

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Image deleted' })
  } catch (error) {
    console.error('Gallery image delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
