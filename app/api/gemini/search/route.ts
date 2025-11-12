import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { searchFilesWithGemini } from '@/lib/gemini'

const searchSchema = z.object({
  query: z.string().min(1, 'Query is required'),
  fileUris: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth()(request)

    const body = await request.json()
    const data = searchSchema.parse(body)

    // Search files using Gemini
    const result = await searchFilesWithGemini(data.query, data.fileUris)

    return NextResponse.json({
      success: true,
      query: result.query,
      answer: result.answer,
      fileUris: result.fileUris,
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

    if (error.message.includes('GEMINI_API_KEY')) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    console.error('File search error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to search files' },
      { status: 500 }
    )
  }
}

