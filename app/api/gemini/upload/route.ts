import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { uploadFileToGemini } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth()(request)
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const displayName = formData.get('displayName') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Upload file to Gemini
    const result = await uploadFileToGemini(
      file,
      file.type || 'application/octet-stream',
      displayName || file.name
    )

    return NextResponse.json({
      success: true,
      fileUri: result.fileUri,
      file: {
        name: result.file.name,
        uri: result.file.uri,
        mimeType: result.file.mimeType,
        sizeBytes: result.file.sizeBytes,
        createTime: result.file.createTime,
        updateTime: result.file.updateTime,
        expirationTime: result.file.expirationTime,
        sha256Hash: result.file.sha256Hash,
      },
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

    console.error('File upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    )
  }
}

