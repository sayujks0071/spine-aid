'use client'

import { useState, useEffect } from 'react'
import { FiSend, FiMessageCircle } from 'react-icons/fi'

interface Message {
  id: string
  content: string
  sender: {
    id: string
    firstName: string
    lastName: string
  }
  recipient: {
    id: string
    firstName: string
    lastName: string
  }
  read: boolean
  createdAt: string
  donation?: {
    id: string
    title: string
  }
  request?: {
    id: string
    title: string
  }
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch('/api/messages/conversations')
        if (response.ok) {
          const data = await response.json()
          setConversations(data)
          if (data.length > 0 && !selectedConversation) {
            setSelectedConversation(data[0].userId)
          }
        }
      } catch (error) {
        console.error('Error fetching conversations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          const response = await fetch(`/api/messages/${selectedConversation}`)
          if (response.ok) {
            const data = await response.json()
            setMessages(data)
          }
        } catch (error) {
          console.error('Error fetching messages:', error)
        }
      }

      fetchMessages()
    }
  }, [selectedConversation])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: selectedConversation,
          content: newMessage,
        }),
      })

      if (response.ok) {
        setNewMessage('')
        // Refresh messages
        const messagesResponse = await fetch(`/api/messages/${selectedConversation}`)
        if (messagesResponse.ok) {
          const data = await messagesResponse.json()
          setMessages(data)
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

        <div className="bg-white rounded-lg shadow-lg flex" style={{ height: '600px' }}>
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FiMessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No conversations yet</p>
              </div>
            ) : (
              <div>
                {conversations.map((conversation) => (
                  <button
                    key={conversation.userId}
                    onClick={() => setSelectedConversation(conversation.userId)}
                    className={`w-full p-4 text-left border-b border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      selectedConversation === conversation.userId ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="font-semibold text-gray-900">
                      {conversation.name}
                    </div>
                    {conversation.lastMessage && (
                      <div className="text-sm text-gray-600 mt-1 truncate">
                        {conversation.lastMessage}
                      </div>
                    )}
                    {conversation.unreadCount > 0 && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {conversation.unreadCount} new
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender.id === selectedConversation ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender.id === selectedConversation
                            ? 'bg-gray-200 text-gray-900'
                            : 'bg-primary-600 text-white'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender.id === selectedConversation
                              ? 'text-gray-500'
                              : 'text-primary-100'
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <FiSend className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FiMessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


