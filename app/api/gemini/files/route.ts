import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { listGeminiFiles } from '@/lib/gemini'

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth()(request)

    // List all files
    const files = await listGeminiFiles()

    return NextResponse.json({
      success: true,
      files: files.map((file: any) => ({
        name: file.name,
        uri: file.uri,
        mimeType: file.mimeType,
        sizeBytes: file.sizeBytes,
        createTime: file.createTime,
        updateTime: file.updateTime,
        expirationTime: file.expirationTime,
        sha256Hash: file.sha256Hash,
      })),
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    if (error.message.includes('GEMINI_API_KEY')) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    console.error('List files error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to list files' },
      { status: 500 }
    )
  }
}

