'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { FiMapPin, FiPackage, FiCheck } from 'react-icons/fi'

const donorProfileSchema = z.object({
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  country: z.string().default('USA'),
  pickupNotes: z.string().optional(),
  dropOffNotes: z.string().optional(),
  preferredContact: z.string().optional(),
})

const recipientProfileSchema = z.object({
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  country: z.string().default('USA'),
  deliveryInstructions: z.string().optional(),
  preferredItems: z.array(z.string()).optional(),
  urgentNeeds: z.string().optional(),
})

type DonorProfileFormData = z.infer<typeof donorProfileSchema>
type RecipientProfileFormData = z.infer<typeof recipientProfileSchema>

export default function OnboardingPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          router.push('/login')
          return
        }
        const userData = await response.json()
        setUser(userData)

        // Check if profile already exists
        const profileResponse = await fetch('/api/profile/check')
        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          if (profileData.exists) {
            router.push('/dashboard')
            return
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const isDonor = user?.role === 'DONOR'
  const isRecipient = user?.role === 'RECIPIENT'

  const donorForm = useForm<DonorProfileFormData>({
    resolver: zodResolver(donorProfileSchema),
  })

  const recipientForm = useForm<RecipientProfileFormData>({
    resolver: zodResolver(recipientProfileSchema),
  })

  const onSubmitDonor = async (data: DonorProfileFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/profile/donor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create profile')
      }

      toast.success('Profile created successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmitRecipient = async (data: RecipientProfileFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/profile/recipient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create profile')
      }

      toast.success('Profile created successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Profile
            </h1>
            <p className="text-gray-600">
              {isDonor
                ? 'Tell us about your location and preferences so we can help you connect with recipients.'
                : 'Help us understand your needs so we can match you with the right donations.'}
            </p>
          </div>

          {isDonor && (
            <form onSubmit={donorForm.handleSubmit(onSubmitDonor)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  {...donorForm.register('address')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {donorForm.formState.errors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {donorForm.formState.errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...donorForm.register('city')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {donorForm.formState.errors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {donorForm.formState.errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...donorForm.register('state')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {donorForm.formState.errors.state && (
                    <p className="mt-1 text-sm text-red-600">
                      {donorForm.formState.errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  {...donorForm.register('zipCode')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {donorForm.formState.errors.zipCode && (
                  <p className="mt-1 text-sm text-red-600">
                    {donorForm.formState.errors.zipCode.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup Notes (optional)
                </label>
                <textarea
                  {...donorForm.register('pickupNotes')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Any special instructions for pickup?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Drop-off Notes (optional)
                </label>
                <textarea
                  {...donorForm.register('dropOffNotes')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Any special instructions for drop-off?"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Saving...' : 'Complete Profile'}
              </button>
            </form>
          )}

          {isRecipient && (
            <form onSubmit={recipientForm.handleSubmit(onSubmitRecipient)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  {...recipientForm.register('address')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {recipientForm.formState.errors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {recipientForm.formState.errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...recipientForm.register('city')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {recipientForm.formState.errors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {recipientForm.formState.errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...recipientForm.register('state')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {recipientForm.formState.errors.state && (
                    <p className="mt-1 text-sm text-red-600">
                      {recipientForm.formState.errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  {...recipientForm.register('zipCode')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {recipientForm.formState.errors.zipCode && (
                  <p className="mt-1 text-sm text-red-600">
                    {recipientForm.formState.errors.zipCode.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Instructions (optional)
                </label>
                <textarea
                  {...recipientForm.register('deliveryInstructions')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Any special delivery instructions?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Urgent Needs (optional)
                </label>
                <textarea
                  {...recipientForm.register('urgentNeeds')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Describe any urgent needs you have"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Saving...' : 'Complete Profile'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}


