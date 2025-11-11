import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()(request)

    if (user.role === 'DONOR') {
      const profile = await prisma.donorProfile.findUnique({
        where: { userId: user.id },
      })
      return NextResponse.json({ exists: !!profile })
    } else if (user.role === 'RECIPIENT') {
      const profile = await prisma.recipientProfile.findUnique({
        where: { userId: user.id },
      })
      return NextResponse.json({ exists: !!profile })
    }

    return NextResponse.json({ exists: false })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    console.error('Profile check error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}

