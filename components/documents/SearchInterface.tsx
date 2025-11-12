'use client'

import { useState } from 'react'
import { FiSearch, FiFile, FiLoader, FiMessageSquare } from 'react-icons/fi'
import toast from 'react-hot-toast'

interface SearchInterfaceProps {
  availableFiles?: Array<{ uri: string; name: string }>
  onSearchComplete?: (result: any) => void
}

export function SearchInterface({ availableFiles = [], onSearchComplete }: SearchInterfaceProps) {
  const [query, setQuery] = useState('')
  const [selectedFileUris, setSelectedFileUris] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<{
    query: string
    answer: string
    fileUris: string[]
  } | null>(null)

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query')
      return
    }

    setIsSearching(true)
    setSearchResult(null)

    try {
      const response = await fetch('/api/gemini/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          fileUris: selectedFileUris.length > 0 ? selectedFileUris : undefined,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Search failed')
      }

      const result = await response.json()
      setSearchResult(result)
      
      if (onSearchComplete) {
        onSearchComplete(result)
      }
    } catch (error: any) {
      console.error('Search error:', error)
      toast.error(error.message || 'Failed to search documents')
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSearch()
    }
  }

  const toggleFileSelection = (fileUri: string) => {
    setSelectedFileUris((prev) =>
      prev.includes(fileUri)
        ? prev.filter((uri) => uri !== fileUri)
        : [...prev, fileUri]
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Documents</h2>

      {/* File Selection (if files available) */}
      {availableFiles.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search in specific files (optional - leave empty to search all)
          </label>
          <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2 space-y-1">
            {availableFiles.map((file) => {
              const isSelected = selectedFileUris.includes(file.uri)
              return (
                <label
                  key={file.uri}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleFileSelection(file.uri)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <FiFile className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700 truncate">{file.name}</span>
                </label>
              )
            })}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ask a question or search for information
        </label>
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., What's the pressure sore prevention protocol? How do I apply for ADIP subsidy?"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
          >
            {isSearching ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Searching...
              </>
            ) : (
              <>
                <FiSearch className="mr-2" />
                Search
              </>
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Tip: Ask questions in English, Hindi, Tamil, or any language. The system will search through uploaded documents.
        </p>
      </div>

      {/* Search Results */}
      {searchResult && (
        <div className="mt-6 border-t pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <FiMessageSquare className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900">Search Results</h3>
          </div>
          <div className="bg-primary-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Query:</span> {searchResult.query}
            </p>
            {searchResult.fileUris.length > 0 && (
              <p className="text-xs text-gray-500">
                Searched in {searchResult.fileUris.length} file(s)
              </p>
            )}
          </div>
          <div className="prose max-w-none">
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {searchResult.answer}
            </div>
          </div>
        </div>
      )}

      {/* Example Queries */}
      {!searchResult && !isSearching && (
        <div className="mt-6 border-t pt-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Example queries:</p>
          <div className="space-y-2">
            {[
              "What's the proper wheelchair fitting procedure?",
              "How do I apply for ADIP subsidy in Maharashtra?",
              "What are the pressure sore prevention guidelines?",
              "What documents are needed for CSR donations?",
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => setQuery(example)}
                className="block w-full text-left text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 p-2 rounded transition-colors"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

