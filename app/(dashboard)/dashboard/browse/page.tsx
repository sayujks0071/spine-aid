'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiSearch, FiFilter, FiMapPin, FiPackage, FiHeart } from 'react-icons/fi'
import { ItemCategory, Condition } from '@prisma/client'

interface Donation {
  id: string
  title: string
  description: string
  category: ItemCategory
  condition: Condition
  photos: string[]
  location: string
  city: string
  state: string
  status: string
  donor: {
    firstName: string
    lastName: string
    organizationName?: string
  }
}

export default function BrowsePage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'ALL'>('ALL')
  const [selectedCondition, setSelectedCondition] = useState<Condition | 'ALL'>('ALL')

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch('/api/donations/browse')
        if (response.ok) {
          const data = await response.json()
          setDonations(data)
          setFilteredDonations(data)
        }
      } catch (error) {
        console.error('Error fetching donations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDonations()
  }, [])

  useEffect(() => {
    let filtered = donations

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (donation) =>
          donation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          donation.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          donation.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          donation.state.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter((donation) => donation.category === selectedCategory)
    }

    // Filter by condition
    if (selectedCondition !== 'ALL') {
      filtered = filtered.filter((donation) => donation.condition === selectedCondition)
    }

    setFilteredDonations(filtered)
  }, [searchQuery, selectedCategory, selectedCondition, donations])

  const getCategoryLabel = (category: ItemCategory) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const getConditionLabel = (condition: Condition) => {
    return condition.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Available Donations</h1>
          <p className="text-gray-600">Find the items you need from our community of donors</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by item, location, or description..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ItemCategory | 'ALL')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="ALL">All Categories</option>
                {Object.values(ItemCategory).map((category) => (
                  <option key={category} value={category}>
                    {getCategoryLabel(category)}
                  </option>
                ))}
              </select>

              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value as Condition | 'ALL')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="ALL">All Conditions</option>
                {Object.values(Condition).map((condition) => (
                  <option key={condition} value={condition}>
                    {getConditionLabel(condition)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredDonations.length} of {donations.length} available items
          </p>
        </div>

        {filteredDonations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FiPackage className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonations.map((donation) => (
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
                    <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded">
                      {getCategoryLabel(donation.category)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {donation.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FiMapPin className="h-4 w-4 mr-1" />
                    {donation.city}, {donation.state}
                  </div>
                  <div className="text-sm text-gray-600">
                    Condition: <span className="font-medium">{getConditionLabel(donation.condition)}</span>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    Donated by{' '}
                    {donation.donor.organizationName || `${donation.donor.firstName} ${donation.donor.lastName}`}
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

