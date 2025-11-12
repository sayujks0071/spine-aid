import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()(request)

    const [activeDonations, pendingRequests, unreadMessages, unreadNotifications] = await Promise.all([
      // Active donations (for donors)
      user.role === 'DONOR'
        ? prisma.donation.count({
            where: {
              donorId: user.id,
              status: {
                in: ['OFFERED', 'ACCEPTED', 'IN_TRANSIT'],
              },
            },
          })
        : 0,

      // Pending requests (for recipients)
      user.role === 'RECIPIENT'
        ? prisma.request.count({
            where: {
              recipientId: user.id,
              status: {
                in: ['OFFERED', 'ACCEPTED'],
              },
            },
          })
        : 0,

      // Unread messages
      prisma.message.count({
        where: {
          recipientId: user.id,
          read: false,
        },
      }),

      // Unread notifications
      prisma.notification.count({
        where: {
          userId: user.id,
          read: false,
        },
      }),
    ])

    return NextResponse.json({
      activeDonations,
      pendingRequests,
      unreadMessages,
      unreadNotifications,
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}


