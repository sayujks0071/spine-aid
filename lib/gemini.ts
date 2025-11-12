import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables')
  }
  return new GoogleGenerativeAI(apiKey)
}

/**
 * Upload a file to Gemini File API using REST API
 */
export async function uploadFileToGemini(
  file: File | Buffer,
  mimeType: string,
  displayName?: string
) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set')
    }

    const fileData = file instanceof File 
      ? Buffer.from(await file.arrayBuffer())
      : file

    // Upload file using REST API with multipart/form-data
    // Using form-data package for Node.js compatibility
    const FormDataLib = require('form-data')
    const formData = new FormDataLib()
    formData.append('file', fileData, {
      filename: displayName || `file-${Date.now()}`,
      contentType: mimeType,
    })
    formData.append('mimeType', mimeType)

    const response = await fetch(
      `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`,
      {
        method: 'POST',
        body: formData as any,
        headers: formData.getHeaders(),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Upload failed: ${error}`)
    }

    const result = await response.json()
    return {
      fileUri: result.file?.uri || result.uri,
      file: result.file || result,
    }
  } catch (error: any) {
    console.error('Error uploading file to Gemini:', error)
    throw new Error(`Failed to upload file: ${error.message}`)
  }
}

/**
 * List all files in Gemini using REST API
 */
export async function listGeminiFiles() {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set')
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/files?key=${apiKey}`,
      {
        method: 'GET',
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`List files failed: ${error}`)
    }

    const result = await response.json()
    return result.files || []
  } catch (error: any) {
    console.error('Error listing Gemini files:', error)
    throw new Error(`Failed to list files: ${error.message}`)
  }
}

/**
 * Get file metadata from Gemini using REST API
 */
export async function getGeminiFile(fileUri: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set')
    }

    // Extract file name from URI if needed
    const fileName = fileUri.split('/').pop() || fileUri
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/files/${fileName}?key=${apiKey}`,
      {
        method: 'GET',
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Get file failed: ${error}`)
    }

    return await response.json()
  } catch (error: any) {
    console.error('Error getting Gemini file:', error)
    throw new Error(`Failed to get file: ${error.message}`)
  }
}

/**
 * Delete a file from Gemini using REST API
 */
export async function deleteGeminiFile(fileUri: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set')
    }

    // Extract file name from URI if needed
    const fileName = fileUri.split('/').pop() || fileUri
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/files/${fileName}?key=${apiKey}`,
      {
        method: 'DELETE',
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Delete file failed: ${error}`)
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error deleting Gemini file:', error)
    throw new Error(`Failed to delete file: ${error.message}`)
  }
}

/**
 * Search files using Gemini with a query
 * This uses the Gemini model to search through uploaded files
 */
export async function searchFilesWithGemini(
  query: string,
  fileUris?: string[]
) {
  try {
    const genAI = getGeminiClient()
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

    // Build parts array with text and file data
    const parts: any[] = [{ text: query }]

    // Add file URIs if provided
    if (fileUris && fileUris.length > 0) {
      parts.push(
        ...fileUris.map(uri => ({
          fileData: {
            fileUri: uri,
            mimeType: 'application/pdf', // Default, can be enhanced
          },
        }))
      )
    }

    const result = await model.generateContent({
      contents: [{ role: 'user', parts }],
    })

    const response = await result.response
    const text = response.text()

    return {
      query,
      answer: text,
      fileUris: fileUris || [],
    }
  } catch (error: any) {
    console.error('Error searching files with Gemini:', error)
    throw new Error(`Failed to search files: ${error.message}`)
  }
}

/**
 * Generate content using Gemini with file context
 */
export async function generateContentWithFiles(
  prompt: string,
  fileUris: string[],
  modelName: string = 'gemini-1.5-pro'
) {
  try {
    const genAI = getGeminiClient()
    const model = genAI.getGenerativeModel({ model: modelName })

    const parts: any[] = [{ text: prompt }]
    
    // Add file URIs
    parts.push(
      ...fileUris.map(uri => ({
        fileData: {
          fileUri: uri,
          mimeType: 'application/pdf', // Default, can be enhanced based on file type
        },
      }))
    )

    const result = await model.generateContent({
      contents: [{ role: 'user', parts }],
    })

    const response = await result.response
    return {
      text: response.text(),
      candidates: response.candidates,
    }
  } catch (error: any) {
    console.error('Error generating content with files:', error)
    throw new Error(`Failed to generate content: ${error.message}`)
  }
}

