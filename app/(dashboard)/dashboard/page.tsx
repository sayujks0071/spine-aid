'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiPackage, FiInbox, FiBell, FiPlus, FiArrowRight, FiFileText } from 'react-icons/fi'

interface DashboardStats {
  activeDonations: number
  pendingRequests: number
  unreadMessages: number
  unreadNotifications: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats>({
    activeDonations: 0,
    pendingRequests: 0,
    unreadMessages: 0,
    unreadNotifications: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

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

        // Fetch dashboard stats
        const statsResponse = await fetch('/api/dashboard/stats')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

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

  const isDonor = user.role === 'DONOR'
  const isRecipient = user.role === 'RECIPIENT'

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening with your {isDonor ? 'donations' : 'requests'} today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isDonor && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Donations</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeDonations}</p>
                </div>
                <div className="bg-primary-100 p-3 rounded-full">
                  <FiPackage className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <Link
                href="/dashboard/donations"
                className="mt-4 text-sm text-primary-600 hover:text-primary-700 inline-flex items-center"
              >
                View all <FiArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          )}

          {isRecipient && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingRequests}</p>
                </div>
                <div className="bg-primary-100 p-3 rounded-full">
                  <FiInbox className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <Link
                href="/dashboard/requests"
                className="mt-4 text-sm text-primary-600 hover:text-primary-700 inline-flex items-center"
              >
                View all <FiArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.unreadMessages}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-full">
                <FiInbox className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <Link
              href="/dashboard/messages"
              className="mt-4 text-sm text-primary-600 hover:text-primary-700 inline-flex items-center"
            >
              View all <FiArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Notifications</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.unreadNotifications}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-full">
                <FiBell className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <Link
              href="/dashboard/notifications"
              className="mt-4 text-sm text-primary-600 hover:text-primary-700 inline-flex items-center"
            >
              View all <FiArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {isDonor && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/dashboard/donations/new"
                  className="flex items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-center">
                    <FiPlus className="h-5 w-5 text-primary-600 mr-3" />
                    <span className="font-medium text-gray-900">List a New Donation</span>
                  </div>
                  <FiArrowRight className="h-5 w-5 text-gray-400" />
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">Complete Your Profile</span>
                  <FiArrowRight className="h-5 w-5 text-gray-400" />
                </Link>
                <Link
                  href="/dashboard/documents"
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-center">
                    <FiFileText className="h-5 w-5 text-primary-600 mr-3" />
                    <span className="font-medium text-gray-900">Document Library</span>
                  </div>
                  <FiArrowRight className="h-5 w-5 text-gray-400" />
                </Link>
              </div>
            </div>
          )}

          {isRecipient && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/dashboard/requests/new"
                  className="flex items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-center">
                    <FiPlus className="h-5 w-5 text-primary-600 mr-3" />
                    <span className="font-medium text-gray-900">Create a Request</span>
                  </div>
                  <FiArrowRight className="h-5 w-5 text-gray-400" />
                </Link>
                <Link
                  href="/dashboard/browse"
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">Browse Available Items</span>
                  <FiArrowRight className="h-5 w-5 text-gray-400" />
                </Link>
                <Link
                  href="/dashboard/documents"
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-center">
                    <FiFileText className="h-5 w-5 text-primary-600 mr-3" />
                    <span className="font-medium text-gray-900">Document Library</span>
                  </div>
                  <FiArrowRight className="h-5 w-5 text-gray-400" />
                </Link>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <p className="text-gray-500 text-sm">No recent activity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


