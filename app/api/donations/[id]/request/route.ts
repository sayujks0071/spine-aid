import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(['RECIPIENT'])(request)
    const { id: donationId } = await params

    // Get donation
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
    })

    if (!donation) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      )
    }

    if (donation.status !== 'OFFERED') {
      return NextResponse.json(
        { error: 'Donation is no longer available' },
        { status: 400 }
      )
    }

    // Check if user already has a request for this donation
    const existingRequest = await prisma.request.findFirst({
      where: {
        recipientId: user.id,
        donationId: donationId,
      },
    })

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You have already requested this donation' },
        { status: 400 }
      )
    }

    // Create request
    const newRequest = await prisma.request.create({
      data: {
        recipientId: user.id,
        donationId: donationId,
        title: `Request for ${donation.title}`,
        description: `Requesting ${donation.title} from ${donation.city}, ${donation.state}`,
        category: donation.category,
        status: 'OFFERED',
      },
    })

    // Create request status history
    await prisma.requestStatusHistory.create({
      data: {
        requestId: newRequest.id,
        status: 'OFFERED',
        changedBy: user.id,
      },
    })

    // Notify donor
    await prisma.notification.create({
      data: {
        userId: donation.donorId,
        type: 'NEW_REQUEST',
        title: 'New Donation Request',
        message: `${user.firstName} ${user.lastName} has requested your donation "${donation.title}"`,
        link: `/dashboard/donations/${donationId}`,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'DONATION_REQUESTED',
        entityType: 'REQUEST',
        entityId: newRequest.id,
        details: {
          donationId: donationId,
        },
      },
    })

    return NextResponse.json(
      { request: newRequest, message: 'Request submitted successfully' },
      { status: 201 }
    )
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    console.error('Request creation error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}

