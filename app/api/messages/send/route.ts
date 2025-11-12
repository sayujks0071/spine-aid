import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const messageSchema = z.object({
  recipientId: z.string(),
  content: z.string().min(1),
  donationId: z.string().optional(),
  requestId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()(request)
    const body = await request.json()
    const data = messageSchema.parse(body)

    const message = await prisma.message.create({
      data: {
        senderId: user.id,
        recipientId: data.recipientId,
        content: data.content,
        donationId: data.donationId,
        requestId: data.requestId,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        recipient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    // Create notification for recipient
    await prisma.notification.create({
      data: {
        userId: data.recipientId,
        type: 'NEW_MESSAGE',
        title: 'New Message',
        message: `You have a new message from ${user.firstName} ${user.lastName}`,
        link: `/dashboard/messages`,
      },
    })

    return NextResponse.json({ message }, { status: 201 })
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

    console.error('Send message error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}


