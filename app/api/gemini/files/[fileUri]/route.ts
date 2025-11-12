import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getGeminiFile, deleteGeminiFile } from '@/lib/gemini'

// GET - Get file metadata
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileUri: string }> }
) {
  try {
    const user = await requireAuth()(request)
    const { fileUri: fileUriParam } = await params
    const fileUri = decodeURIComponent(fileUriParam)

    const file = await getGeminiFile(fileUri)

    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        uri: file.uri,
        mimeType: file.mimeType,
        sizeBytes: file.sizeBytes,
        createTime: file.createTime,
        updateTime: file.updateTime,
        expirationTime: file.expirationTime,
        sha256Hash: file.sha256Hash,
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

    console.error('Get file error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get file' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a file
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ fileUri: string }> }
) {
  try {
    const user = await requireAuth()(request)
    const { fileUri: fileUriParam } = await params
    const fileUri = decodeURIComponent(fileUriParam)

    await deleteGeminiFile(fileUri)

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
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

    console.error('Delete file error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete file' },
      { status: 500 }
    )
  }
}

