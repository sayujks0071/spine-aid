import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { generateContentWithFiles } from '@/lib/gemini'

const generateSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  fileUris: z.array(z.string()).min(1, 'At least one file URI is required'),
  modelName: z.string().optional().default('gemini-1.5-pro'),
})

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth()(request)

    const body = await request.json()
    const data = generateSchema.parse(body)

    // Generate content with files
    const result = await generateContentWithFiles(
      data.prompt,
      data.fileUris,
      data.modelName
    )

    return NextResponse.json({
      success: true,
      text: result.text,
      candidates: result.candidates,
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

    console.error('Generate content error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate content' },
      { status: 500 }
    )
  }
}

