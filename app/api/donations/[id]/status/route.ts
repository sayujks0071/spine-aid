import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const statusUpdateSchema = z.object({
  status: z.enum(['OFFERED', 'ACCEPTED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']),
  notes: z.string().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()(request)
    const { id } = await params
    const body = await request.json()
    const data = statusUpdateSchema.parse(body)

    // Get donation to verify ownership or recipient relationship
    const donation = await prisma.donation.findUnique({
      where: { id },
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

    // Verify permissions
    const isDonor = donation.donorId === user.id
    const isRecipient = donation.acceptedRequest?.recipientId === user.id
    const isAdmin = user.role === 'ADMIN'

    if (!isDonor && !isRecipient && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized to update this donation' },
        { status: 403 }
      )
    }

    // Validate status transitions
    const validTransitions: Record<string, string[]> = {
      OFFERED: ['ACCEPTED', 'CANCELLED'],
      ACCEPTED: ['IN_TRANSIT', 'CANCELLED'],
      IN_TRANSIT: ['DELIVERED', 'CANCELLED'],
      DELIVERED: [], // Final state
      CANCELLED: [], // Final state
    }

    if (!validTransitions[donation.status].includes(data.status)) {
      return NextResponse.json(
        { error: `Invalid status transition from ${donation.status} to ${data.status}` },
        { status: 400 }
      )
    }

    // Update donation status
    const updatedDonation = await prisma.donation.update({
      where: { id },
      data: {
        status: data.status,
      },
    })

    // Create status history entry
    await prisma.donationStatusHistory.create({
      data: {
        donationId: id,
        status: data.status,
        notes: data.notes || null,
        changedBy: user.id,
      },
    })

    // Create notification for the other party
    if (isDonor && donation.acceptedRequest) {
      await prisma.notification.create({
        data: {
          userId: donation.acceptedRequest.recipientId,
          type: 'STATUS_UPDATE',
          title: 'Donation Status Updated',
          message: `Donation "${donation.title}" status changed to ${data.status.replace(/_/g, ' ')}`,
          link: `/dashboard/donations/${id}`,
        },
      })
    } else if (isRecipient) {
      await prisma.notification.create({
        data: {
          userId: donation.donorId,
          type: 'STATUS_UPDATE',
          title: 'Donation Status Updated',
          message: `Donation "${donation.title}" status changed to ${data.status.replace(/_/g, ' ')}`,
          link: `/dashboard/donations/${id}`,
        },
      })
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'DONATION_STATUS_UPDATED',
        entityType: 'DONATION',
        entityId: id,
        details: {
          oldStatus: donation.status,
          newStatus: data.status,
          notes: data.notes,
        },
      },
    })

    return NextResponse.json({
      donation: updatedDonation,
      message: 'Status updated successfully',
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

    console.error('Status update error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}

