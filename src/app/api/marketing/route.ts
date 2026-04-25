import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { MarketingPopup } from '@/models/Marketing'
import { verifyAuth } from '@/lib/auth'

const defaultPopup = {
  enabled: false,
  title: 'Offre spéciale',
  description: 'Profitez de nos offres exclusives dès maintenant !',
  buttonText: 'En savoir plus',
  buttonLink: '#',
  imageUrl: '',
  bgColor: '#ffffff',
  textColor: '#111827',
  buttonColor: '#2563eb',
  delay: 5,
  banner: {
    enabled: false,
    text: '',
    link: '',
    bgColor: '#111827',
    textColor: '#ffffff',
  },
}

// GET marketing popup settings (public)
export async function GET() {
  try {
    await connectDB()
    const popup = await MarketingPopup.findOne()

    if (!popup) {
      return NextResponse.json(defaultPopup)
    }

    return NextResponse.json(popup)
  } catch (error) {
    console.error('Marketing popup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// UPDATE marketing popup settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const { authenticated, user } = await verifyAuth(request)
    if (!authenticated || user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const body = await request.json()

    let popup = await MarketingPopup.findOne()
    if (!popup) {
      popup = await MarketingPopup.create(body)
    } else {
      const fields = ['enabled', 'title', 'description', 'buttonText', 'buttonLink', 'imageUrl', 'bgColor', 'textColor', 'buttonColor', 'delay', 'banner']
      for (const field of fields) {
        if (body[field] !== undefined) (popup as any)[field] = body[field]
      }
      await popup.save()
    }

    return NextResponse.json(popup)
  } catch (error) {
    console.error('Marketing popup update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
