import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { UserRole } from '@prisma/client'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  firstName: string
  lastName: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
    return decoded
  } catch (error) {
    return null
  }
}

export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    return null
  }

  const user = verifyToken(token)
  if (!user) {
    return null
  }

  // Verify user still exists in database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      role: true,
      firstName: true,
      lastName: true,
    },
  })

  return dbUser
}

export function requireAuth(roles?: UserRole[]) {
  return async (request: NextRequest): Promise<AuthUser> => {
    const user = await getAuthUser(request)

    if (!user) {
      throw new Error('Unauthorized')
    }

    if (roles && !roles.includes(user.role)) {
      throw new Error('Forbidden')
    }

    return user
  }
}

