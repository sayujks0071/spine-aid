'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiPlus, FiPackage, FiMapPin } from 'react-icons/fi'
import { DonationStatus } from '@prisma/client'

interface Donation {
  id: string
  title: string
  description: string
  category: string
  condition: string
  photos: string[]
  city: string
  state: string
  status: DonationStatus
  createdAt: string
}

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch('/api/donations/my')
        if (response.ok) {
          const data = await response.json()
          setDonations(data)
        }
      } catch (error) {
        console.error('Error fetching donations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDonations()
  }, [])

  const getStatusColor = (status: DonationStatus) => {
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Donations</h1>
            <p className="text-gray-600 mt-2">Manage your listed donations</p>
          </div>
          <Link
            href="/dashboard/donations/new"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <FiPlus className="h-5 w-5 mr-2" />
            New Donation
          </Link>
        </div>

        {donations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FiPackage className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No donations yet</h3>
            <p className="text-gray-600 mb-6">
              Start helping others by listing your first donation
            </p>
            <Link
              href="/dashboard/donations/new"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <FiPlus className="h-5 w-5 mr-2" />
              List Your First Donation
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => (
              <Link
                key={donation.id}
                href={`/dashboard/donations/${donation.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {donation.photos && donation.photos.length > 0 ? (
                  <img
                    src={donation.photos[0]}
                    alt={donation.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <FiPackage className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{donation.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(donation.status)}`}
                    >
                      {donation.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {donation.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiMapPin className="h-4 w-4 mr-1" />
                    {donation.city}, {donation.state}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

