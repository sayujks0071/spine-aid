import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()(request)

    // Get all unique conversation partners
    const sentMessages = await prisma.message.findMany({
      where: { senderId: user.id },
      select: { recipientId: true },
      distinct: ['recipientId'],
    })

    const receivedMessages = await prisma.message.findMany({
      where: { recipientId: user.id },
      select: { senderId: true },
      distinct: ['senderId'],
    })

    const partnerIds = new Set([
      ...sentMessages.map((m) => m.recipientId),
      ...receivedMessages.map((m) => m.senderId),
    ])

    // Get conversation details
    const conversations = await Promise.all(
      Array.from(partnerIds).map(async (partnerId) => {
        const partner = await prisma.user.findUnique({
          where: { id: partnerId },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            organizationName: true,
          },
        })

        if (!partner) return null

        // Get last message
        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: user.id, recipientId: partnerId },
              { senderId: partnerId, recipientId: user.id },
            ],
          },
          orderBy: { createdAt: 'desc' },
        })

        // Get unread count
        const unreadCount = await prisma.message.count({
          where: {
            senderId: partnerId,
            recipientId: user.id,
            read: false,
          },
        })

        return {
          userId: partner.id,
          name: partner.organizationName || `${partner.firstName} ${partner.lastName}`,
          lastMessage: lastMessage?.content,
          unreadCount,
        }
      })
    )

    return NextResponse.json(conversations.filter(Boolean))
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    console.error('Conversations error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}

