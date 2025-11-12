import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const deliveryConfirmationSchema = z.object({
  recipientSignature: z.string().optional(), // Base64 signature image
  deliveryPhotos: z.array(z.string()).optional(), // Base64 images
  notes: z.string().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()(request)
    const { id: donationId } = await params
    const body = await request.json()
    const data = deliveryConfirmationSchema.parse(body)

    // Get donation
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: {
        acceptedRequest: {
          include: {
            recipient: true,
          },
        },
      },
    })

    if (!donation) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      )
    }

    // Verify permissions - recipient or donor can confirm delivery
    const isRecipient = donation.acceptedRequest?.recipientId === user.id
    const isDonor = donation.donorId === user.id
    const isAdmin = user.role === 'ADMIN'

    if (!isRecipient && !isDonor && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized to confirm delivery' },
        { status: 403 }
      )
    }

    if (donation.status !== 'IN_TRANSIT') {
      return NextResponse.json(
        { error: 'Donation must be in transit before confirming delivery' },
        { status: 400 }
      )
    }

    // Save delivery photos and signature
    const deliveryPhotos: string[] = []
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'deliveries', donationId)
    await mkdir(uploadDir, { recursive: true })

    if (data.deliveryPhotos && data.deliveryPhotos.length > 0) {
      for (let i = 0; i < data.deliveryPhotos.length; i++) {
        const base64Data = data.deliveryPhotos[i].replace(/^data:image\/\w+;base64,/, '')
        const buffer = Buffer.from(base64Data, 'base64')
        const filename = `delivery-${Date.now()}-${i}.jpg`
        const filepath = join(uploadDir, filename)
        await writeFile(filepath, buffer)
        deliveryPhotos.push(`/uploads/deliveries/${donationId}/${filename}`)
      }
    }

    let signaturePath: string | null = null
    if (data.recipientSignature) {
      const base64Data = data.recipientSignature.replace(/^data:image\/\w+;base64,/, '')
      const buffer = Buffer.from(base64Data, 'base64')
      const filename = `signature-${Date.now()}.png`
      const filepath = join(uploadDir, filename)
      await writeFile(filepath, buffer)
      signaturePath = `/uploads/deliveries/${donationId}/${filename}`
    }

    // Update donation to DELIVERED
    const updatedDonation = await prisma.donation.update({
      where: { id: donationId },
      data: {
        status: 'DELIVERED',
      },
    })

    // Create status history with delivery confirmation details
    await prisma.donationStatusHistory.create({
      data: {
        donationId: donationId,
        status: 'DELIVERED',
        notes: data.notes || `Delivery confirmed by ${isRecipient ? 'recipient' : 'donor'}. Photos: ${deliveryPhotos.length}, Signature: ${signaturePath ? 'Yes' : 'No'}`,
        changedBy: user.id,
      },
    })

    // Store delivery confirmation in audit log details
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'DELIVERY_CONFIRMED',
        entityType: 'DONATION',
        entityId: donationId,
        details: {
          deliveryPhotos,
          signaturePath,
          notes: data.notes,
          confirmedBy: isRecipient ? 'recipient' : 'donor',
        },
      },
    })

    // Notify both parties
    if (isRecipient) {
      await prisma.notification.create({
        data: {
          userId: donation.donorId,
          type: 'STATUS_UPDATE',
          title: 'Delivery Confirmed!',
          message: `Delivery of "${donation.title}" has been confirmed by the recipient.`,
          link: `/dashboard/donations/${donationId}`,
        },
      })
    } else if (isDonor) {
      await prisma.notification.create({
        data: {
          userId: donation.acceptedRequest!.recipientId,
          type: 'STATUS_UPDATE',
          title: 'Delivery Confirmed',
          message: `Delivery of "${donation.title}" has been confirmed.`,
          link: `/dashboard/donations/${donationId}`,
        },
      })
    }

    return NextResponse.json({
      donation: updatedDonation,
      deliveryConfirmation: {
        photos: deliveryPhotos,
        signature: signaturePath,
        notes: data.notes,
      },
      message: 'Delivery confirmed successfully',
    })
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

    console.error('Delivery confirmation error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}

