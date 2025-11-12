'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiMapPin, FiClock, FiMessageCircle, FiCheckCircle, FiPackage, FiArrowLeft, FiUpload } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { DeliveryConfirmation } from '@/components/donations/DeliveryConfirmation'

interface Donation {
  id: string
  title: string
  description: string
  category: string
  condition: string
  photos: string[]
  location: string
  city: string
  state: string
  zipCode: string
  status: string
  pickupAvailable: boolean
  dropOffAvailable: boolean
  pickupNotes?: string
  dropOffNotes?: string
  donor: {
    id: string
    firstName: string
    lastName: string
    organizationName?: string
  }
  acceptedRequest?: {
    id: string
    recipient: {
      id: string
      firstName: string
      lastName: string
    }
  }
  statusHistory: Array<{
    id: string
    status: string
    notes?: string
    createdAt: string
    changedBy?: string
  }>
}

export default function DonationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [donation, setDonation] = useState<Donation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [canRequest, setCanRequest] = useState(false)
  const [canAccept, setCanAccept] = useState(false)
  const [canUpdateStatus, setCanUpdateStatus] = useState(false)
  const [showDeliveryForm, setShowDeliveryForm] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = params.id
        
        // Get user
        const userResponse = await fetch('/api/auth/me')
        if (!userResponse.ok) {
          router.push('/login')
          return
        }
        const userData = await userResponse.json()
        setUser(userData)

        // Get donation
        const donationResponse = await fetch(`/api/donations/${id}`)
        if (donationResponse.ok) {
          const donationData = await donationResponse.json()
          setDonation(donationData)
          
          // Check permissions
          const isDonor = donationData.donor.id === userData.id
          const isRecipient = donationData.acceptedRequest?.recipient.id === userData.id
          const isAdmin = userData.role === 'ADMIN'
          
          setCanRequest(!isDonor && donationData.status === 'OFFERED' && userData.role === 'RECIPIENT')
          setCanAccept(isDonor && donationData.status === 'OFFERED' && donationData.requests?.length > 0)
          setCanUpdateStatus(isDonor || isRecipient || isAdmin)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, router])

  const handleRequest = async () => {
    if (!donation) return

    try {
      const response = await fetch(`/api/donations/${donation.id}/request`, {
        method: 'POST',
      })

      if (response.ok) {
        toast.success('Request submitted successfully!')
        router.refresh()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to submit request')
      }
    } catch (error) {
      toast.error('Failed to submit request')
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (!donation) return

    try {
      const response = await fetch(`/api/donations/${donation.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success('Status updated successfully!')
        router.refresh()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update status')
      }
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OFFERED':
        return 'bg-blue-100 text-blue-800'
      case 'ACCEPTED':
        return 'bg-yellow-100 text-yellow-800'
      case 'IN_TRANSIT':
        return 'bg-purple-100 text-purple-800'
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!donation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Donation not found</h2>
          <Link href="/dashboard/donations" className="text-primary-600 hover:text-primary-700">
            Back to donations
          </Link>
        </div>
      </div>
    )
  }

  const isDonor = donation.donor.id === user?.id
  const isRecipient = donation.acceptedRequest?.recipient.id === user?.id

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/dashboard/donations"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back to donations
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Donation Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{donation.title}</h1>
                <span className={`px-3 py-1 text-sm font-medium rounded ${getStatusColor(donation.status)}`}>
                  {donation.status.replace(/_/g, ' ')}
                </span>
              </div>

              <p className="text-gray-600 mb-6">{donation.description}</p>

              {/* Photos */}
              {donation.photos && donation.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {donation.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`${donation.title} - Photo ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{donation.category.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Condition</p>
                  <p className="font-medium">{donation.condition.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium flex items-center">
                    <FiMapPin className="mr-1" />
                    {donation.city}, {donation.state}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Donor</p>
                  <p className="font-medium">
                    {donation.donor.organizationName || `${donation.donor.firstName} ${donation.donor.lastName}`}
                  </p>
                </div>
              </div>

              {/* Pickup/Dropoff Info */}
              {(donation.pickupAvailable || donation.dropOffAvailable) && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Delivery Options</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {donation.pickupAvailable && (
                      <li>✓ Pickup available {donation.pickupNotes && `- ${donation.pickupNotes}`}</li>
                    )}
                    {donation.dropOffAvailable && (
                      <li>✓ Drop-off available {donation.dropOffNotes && `- ${donation.dropOffNotes}`}</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Status Timeline */}
              {donation.statusHistory && donation.statusHistory.length > 0 && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <FiClock className="mr-2" />
                    Status Timeline
                  </h3>
                  <div className="space-y-4">
                    {donation.statusHistory.map((history, index) => (
                      <div key={history.id} className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className={`w-3 h-3 rounded-full ${
                            index === donation.statusHistory.length - 1 ? 'bg-primary-600' : 'bg-gray-300'
                          }`} />
                        </div>
                        <div className="ml-4 flex-1">
                          <p className="font-medium">{history.status.replace(/_/g, ' ')}</p>
                          {history.notes && <p className="text-sm text-gray-600">{history.notes}</p>}
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(history.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            {canRequest && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <button
                  onClick={handleRequest}
                  className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700"
                >
                  Request This Donation
                </button>
              </div>
            )}

            {canUpdateStatus && donation.status !== 'DELIVERED' && donation.status !== 'CANCELLED' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold mb-4">Update Status</h3>
                <div className="space-y-2">
                  {donation.status === 'OFFERED' && isDonor && (
                    <p className="text-sm text-gray-600 mb-2">
                      Accept a request first to proceed with status updates.
                    </p>
                  )}
                  {donation.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleStatusUpdate('IN_TRANSIT')}
                      className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                      Mark as In Transit
                    </button>
                  )}
                  {donation.status === 'IN_TRANSIT' && (
                    <button
                      onClick={() => setShowDeliveryForm(true)}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Confirm Delivery
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Delivery Confirmation Form */}
            {showDeliveryForm && (
              <DeliveryConfirmation
                donationId={donation.id}
                onSuccess={() => {
                  setShowDeliveryForm(false)
                  router.refresh()
                }}
                onCancel={() => setShowDeliveryForm(false)}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href={`/dashboard/messages?userId=${isDonor ? donation.acceptedRequest?.recipient.id : donation.donor.id}`}
                  className="flex items-center w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <FiMessageCircle className="mr-2" />
                  Send Message
                </Link>
                {donation.acceptedRequest && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-500 mb-2">Matched with:</p>
                    <p className="font-medium">
                      {donation.acceptedRequest.recipient.firstName}{' '}
                      {donation.acceptedRequest.recipient.lastName}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <FiPackage className="mr-2" />
                Current Status
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Status:</span>{' '}
                  <span className={getStatusColor(donation.status)}>
                    {donation.status.replace(/_/g, ' ')}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Created:</span>{' '}
                  {new Date(donation.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

