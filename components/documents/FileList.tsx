'use client'

import { useState, useEffect } from 'react'
import { FiFile, FiTrash2, FiSearch, FiClock, FiDownload } from 'react-icons/fi'
import toast from 'react-hot-toast'

interface GeminiFile {
  name: string
  uri: string
  mimeType: string
  sizeBytes: string
  createTime: string
  updateTime: string
  expirationTime?: string
  sha256Hash?: string
}

interface FileListProps {
  onFileSelect?: (fileUri: string) => void
  selectedFiles?: string[]
  showSearchButton?: boolean
}

export function FileList({ onFileSelect, selectedFiles = [], showSearchButton = false }: FileListProps) {
  const [files, setFiles] = useState<GeminiFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingUri, setDeletingUri] = useState<string | null>(null)

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/gemini/files')
      if (!response.ok) {
        throw new Error('Failed to fetch files')
      }
      const data = await response.json()
      setFiles(data.files || [])
    } catch (error: any) {
      console.error('Error fetching files:', error)
      toast.error('Failed to load files')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const handleDelete = async (fileUri: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return
    }

    setDeletingUri(fileUri)

    try {
      const encodedUri = encodeURIComponent(fileUri)
      const response = await fetch(`/api/gemini/files/${encodedUri}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete file')
      }

      toast.success('File deleted successfully')
      fetchFiles() // Refresh list
    } catch (error: any) {
      console.error('Error deleting file:', error)
      toast.error('Failed to delete file')
    } finally {
      setDeletingUri(null)
    }
  }

  const formatFileSize = (bytes: string) => {
    const numBytes = parseInt(bytes)
    if (numBytes < 1024) return numBytes + ' B'
    if (numBytes < 1024 * 1024) return (numBytes / 1024).toFixed(1) + ' KB'
    return (numBytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄'
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝'
    if (mimeType.includes('text')) return '📃'
    return '📎'
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading files...</p>
        </div>
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Uploaded Documents</h2>
        <div className="text-center py-12">
          <FiFile className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No documents uploaded yet</p>
          <p className="text-sm text-gray-500">Upload your first document to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Uploaded Documents ({files.length})
        </h2>
        <button
          onClick={fetchFiles}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {files.map((file) => {
          const isSelected = selectedFiles.includes(file.uri)
          const isDeleting = deletingUri === file.uri

          return (
            <div
              key={file.uri}
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="text-2xl mt-1">{getFileIcon(file.mimeType)}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span>{formatFileSize(file.sizeBytes)}</span>
                      <span className="flex items-center">
                        <FiClock className="mr-1 h-3 w-3" />
                        {formatDate(file.createTime)}
                      </span>
                      <span className="capitalize">
                        {file.mimeType.split('/')[1] || 'file'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {showSearchButton && onFileSelect && (
                    <button
                      onClick={() => onFileSelect(file.uri)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                      title="Search in this file"
                    >
                      <FiSearch className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(file.uri, file.name)}
                    disabled={isDeleting}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                    title="Delete file"
                  >
                    {isDeleting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                    ) : (
                      <FiTrash2 className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

