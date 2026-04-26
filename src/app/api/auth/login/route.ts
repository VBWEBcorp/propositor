import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '@/lib/auth'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export async function POST(request: NextRequest) {
  if (!ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD non configuré côté serveur (.env.local)' },
      { status: 500 }
    )
  }

  const { password } = (await request.json()) as { password?: string }

  if (!password) {
    return NextResponse.json(
      { error: 'Mot de passe requis' },
      { status: 400 }
    )
  }

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'Mot de passe incorrect' },
      { status: 401 }
    )
  }

  const token = generateToken({
    userId: 'vbweb',
    email: 'contact@vbweb.fr',
    role: 'admin',
  })

  return NextResponse.json({
    token,
    user: { email: 'contact@vbweb.fr', role: 'admin' },
  })
}
