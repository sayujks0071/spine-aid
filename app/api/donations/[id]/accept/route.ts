import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const acceptRequestSchema = z.object({
  requestId: z.string(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(['DONOR'])(request)
    const { id: donationId } = await params
    const body = await request.json()
    const { requestId } = acceptRequestSchema.parse(body)

    // Get donation and verify ownership
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
    })

    if (!donation) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      )
    }

    if (donation.donorId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to accept requests for this donation' },
        { status: 403 }
      )
    }

    if (donation.status !== 'OFFERED') {
      return NextResponse.json(
        { error: 'Donation is no longer available' },
        { status: 400 }
      )
    }

    // Get request
    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: {
        recipient: true,
      },
    })

    if (!request || request.donationId !== donationId) {
      return NextResponse.json(
        { error: 'Request not found or does not match donation' },
        { status: 404 }
      )
    }

    // Update donation to ACCEPTED and link request
    const updatedDonation = await prisma.donation.update({
      where: { id: donationId },
      data: {
        status: 'ACCEPTED',
        acceptedRequestId: requestId,
      },
    })

    // Update request status
    await prisma.request.update({
      where: { id: requestId },
      data: {
        status: 'ACCEPTED',
      },
    })

    // Create status history for donation
    await prisma.donationStatusHistory.create({
      data: {
        donationId: donationId,
        status: 'ACCEPTED',
        notes: `Accepted request from ${request.recipient.firstName} ${request.recipient.lastName}`,
        changedBy: user.id,
      },
    })

    // Create status history for request
    await prisma.requestStatusHistory.create({
      data: {
        requestId: requestId,
        status: 'ACCEPTED',
        changedBy: user.id,
      },
    })

    // Notify recipient
    await prisma.notification.create({
      data: {
        userId: request.recipientId,
        type: 'STATUS_UPDATE',
        title: 'Request Accepted!',
        message: `Your request for "${donation.title}" has been accepted. You can now coordinate pickup/delivery.`,
        link: `/dashboard/donations/${donationId}`,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'REQUEST_ACCEPTED',
        entityType: 'DONATION',
        entityId: donationId,
        details: {
          requestId: requestId,
          recipientId: request.recipientId,
        },
      },
    })

    return NextResponse.json({
      donation: updatedDonation,
      message: 'Request accepted successfully',
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

    console.error('Accept request error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}

