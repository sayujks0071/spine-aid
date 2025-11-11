'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { FiMail, FiLock, FiUser, FiPhone, FiArrowRight } from 'react-icons/fi'

const registerSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    phone: z.string().optional(),
    role: z.enum(['DONOR', 'RECIPIENT']),
    organizationName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'DONOR' | 'RECIPIENT' | null>(null)

  useEffect(() => {
    const roleParam = searchParams.get('role')
    if (roleParam === 'donor') {
      setSelectedRole('DONOR')
    } else if (roleParam === 'recipient') {
      setSelectedRole('RECIPIENT')
    }
  }, [searchParams])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: selectedRole || 'DONOR',
    },
  })

  const role = watch('role')

  useEffect(() => {
    if (selectedRole) {
      setValue('role', selectedRole)
    }
  }, [selectedRole, setValue])

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed')
      }

      toast.success('Account created successfully! Please check your email for verification.')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during registration')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-900">
            Create your account
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
            >
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I want to:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('DONOR')
                  setValue('role', 'DONOR')
                }}
                className={`p-4 border-2 rounded-lg text-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  role === 'DONOR'
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                Donate Items
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('RECIPIENT')
                  setValue('role', 'RECIPIENT')
                }}
                className={`p-4 border-2 rounded-lg text-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  role === 'RECIPIENT'
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                Request Support
              </button>
            </div>
            <input type="hidden" {...register('role')} />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    {...register('firstName')}
                    id="firstName"
                    type="text"
                    className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    aria-invalid={errors.firstName ? 'true' : 'false'}
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last name
                </label>
                <input
                  {...register('lastName')}
                  id="lastName"
                  type="text"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  aria-invalid={errors.lastName ? 'true' : 'false'}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="you@example.com"
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone (optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  {...register('phone')}
                  id="phone"
                  type="tel"
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {role === 'DONOR' && (
              <div>
                <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">
                  Organization name (optional)
                </label>
                <input
                  {...register('organizationName')}
                  id="organizationName"
                  type="text"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Your organization"
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  {...register('password')}
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  {...register('confirmPassword')}
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !role}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                'Creating account...'
              ) : (
                <>
                  Create account
                  <FiArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

