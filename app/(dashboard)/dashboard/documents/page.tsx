'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileUpload } from '@/components/documents/FileUpload'
import { FileList } from '@/components/documents/FileList'
import { SearchInterface } from '@/components/documents/SearchInterface'
import { FiFileText, FiSearch, FiUpload } from 'react-icons/fi'

interface GeminiFile {
  name: string
  uri: string
  mimeType: string
  sizeBytes: string
  createTime: string
}

export default function DocumentsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'upload' | 'files' | 'search'>('files')
  const [files, setFiles] = useState<GeminiFile[]>([])
  const [selectedFileUris, setSelectedFileUris] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch('/api/auth/me')
        if (!userResponse.ok) {
          router.push('/login')
          return
        }
        const userData = await userResponse.json()
        setUser(userData)
      } catch (error) {
        console.error('Error fetching user data:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/gemini/files')
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files || [])
      }
    } catch (error) {
      console.error('Error fetching files:', error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchFiles()
    }
  }, [user])

  const handleUploadSuccess = () => {
    fetchFiles()
    setActiveTab('files')
  }

  const handleFileSelect = (fileUri: string) => {
    setSelectedFileUris((prev) =>
      prev.includes(fileUri) ? prev.filter((uri) => uri !== fileUri) : [...prev, fileUri]
    )
    setActiveTab('search')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const availableFiles = files.map((file) => ({
    uri: file.uri,
    name: file.name,
  }))

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Document Library</h1>
          <p className="mt-2 text-gray-600">
            Upload, manage, and search through documents using AI-powered search
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('files')}
              className={`py-4 px-1 border-b-2 font-medium text-sm inline-flex items-center ${
                activeTab === 'files'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FiFileText className="mr-2 h-5 w-5" />
              All Documents
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 px-1 border-b-2 font-medium text-sm inline-flex items-center ${
                activeTab === 'upload'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FiUpload className="mr-2 h-5 w-5" />
              Upload
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`py-4 px-1 border-b-2 font-medium text-sm inline-flex items-center ${
                activeTab === 'search'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FiSearch className="mr-2 h-5 w-5" />
              Search
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'upload' && (
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          )}

          {activeTab === 'files' && (
            <FileList
              onFileSelect={handleFileSelect}
              selectedFiles={selectedFileUris}
              showSearchButton={true}
            />
          )}

          {activeTab === 'search' && (
            <SearchInterface
              availableFiles={availableFiles}
              onSearchComplete={(result) => {
                console.log('Search completed:', result)
              }}
            />
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 How to use Document Library</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>
              <strong>Upload:</strong> Add PDFs, Word documents, or text files (max 20MB) to build your knowledge base
            </li>
            <li>
              <strong>Search:</strong> Ask questions in any language - the AI will search through all uploaded documents
            </li>
            <li>
              <strong>Manage:</strong> View, search within specific files, or delete documents as needed
            </li>
            <li>
              <strong>Use Cases:</strong> Medical protocols, government schemes, CSR guidelines, care instructions, and more
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

