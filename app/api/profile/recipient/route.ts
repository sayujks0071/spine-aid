import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const recipientProfileSchema = z.object({
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/),
  country: z.string().default('USA'),
  deliveryInstructions: z.string().optional(),
  preferredItems: z.array(z.string()).optional(),
  urgentNeeds: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(['RECIPIENT'])(request)
    const body = await request.json()
    const data = recipientProfileSchema.parse(body)

    // Check if profile already exists
    const existing = await prisma.recipientProfile.findUnique({
      where: { userId: user.id },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Profile already exists' },
        { status: 400 }
      )
    }

    // TODO: Geocode address to get latitude/longitude

    const profile = await prisma.recipientProfile.create({
      data: {
        userId: user.id,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        deliveryInstructions: data.deliveryInstructions,
        preferredItems: data.preferredItems || [],
        urgentNeeds: data.urgentNeeds,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'RECIPIENT_PROFILE_CREATED',
        entityType: 'RECIPIENT_PROFILE',
        entityId: profile.id,
      },
    })

    return NextResponse.json({ profile }, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Recipient profile creation error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}


