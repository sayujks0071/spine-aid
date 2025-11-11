import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const donationSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  category: z.string(),
  condition: z.string(),
  location: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/),
  pickupAvailable: z.boolean(),
  dropOffAvailable: z.boolean(),
  pickupNotes: z.string().optional(),
  dropOffNotes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(['DONOR'])(request)
    const formData = await request.formData()

    const dataString = formData.get('data') as string
    const data = donationSchema.parse(JSON.parse(dataString))

    // Handle photo uploads
    const photos: string[] = []
    const photoFiles = formData.getAll('photos') as File[]

    if (photoFiles.length === 0) {
      return NextResponse.json(
        { error: 'At least one photo is required' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'donations')
    await mkdir(uploadDir, { recursive: true })

    // Save photos
    for (const photo of photoFiles) {
      const bytes = await photo.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${photo.name}`
      const filepath = join(uploadDir, filename)
      await writeFile(filepath, buffer)
      photos.push(`/uploads/donations/${filename}`)
    }

    // Create donation
    const donation = await prisma.donation.create({
      data: {
        donorId: user.id,
        title: data.title,
        description: data.description,
        category: data.category as any,
        condition: data.condition as any,
        photos,
        location: data.location,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        pickupAvailable: data.pickupAvailable,
        dropOffAvailable: data.dropOffAvailable,
        pickupNotes: data.pickupNotes,
        dropOffNotes: data.dropOffNotes,
        status: 'OFFERED',
      },
    })

    // Create status history
    await prisma.donationStatusHistory.create({
      data: {
        donationId: donation.id,
        status: 'OFFERED',
        changedBy: user.id,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'DONATION_CREATED',
        entityType: 'DONATION',
        entityId: donation.id,
      },
    })

    return NextResponse.json({ donation }, { status: 201 })
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

    console.error('Donation creation error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}

