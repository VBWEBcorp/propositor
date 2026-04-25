import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { GallerySettings } from '@/models/Gallery'
import { verifyAuth } from '@/lib/auth'

// GET gallery settings (public)
export async function GET() {
  try {
    await connectDB()
    const settings = await GallerySettings.findOne()

    if (!settings) {
      return NextResponse.json({ enabled: false, title: 'Nos réalisations', eyebrow: 'Galerie', description: 'Découvrez nos projets récents et laissez-vous inspirer par notre savoir-faire.' })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Gallery settings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// UPDATE gallery settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const { authenticated, user } = await verifyAuth(request)
    if (!authenticated || user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const body = await request.json()

    let settings = await GallerySettings.findOne()
    if (!settings) {
      settings = await GallerySettings.create(body)
    } else {
      const fields = ['enabled', 'title', 'description', 'eyebrow', 'heroImage']
      for (const field of fields) {
        if (body[field] !== undefined) (settings as any)[field] = body[field]
      }
      await settings.save()
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Gallery settings update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
