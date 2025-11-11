'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { FiMenu, FiX, FiHeart, FiUser, FiLogOut } from 'react-icons/fi'
import { cn } from '@/lib/utils'

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const user = await response.json()
          setIsAuthenticated(true)
          setUserRole(user.role)
        }
      } catch (error) {
        setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setIsAuthenticated(false)
      setUserRole(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/resources', label: 'Resources' },
    { href: '/volunteer', label: 'Volunteer' },
  ]

  const authLinks = isAuthenticated
    ? [
        { href: '/dashboard', label: 'Dashboard', icon: FiUser },
        { href: '#', label: 'Logout', icon: FiLogOut, onClick: handleLogout },
      ]
    : [
        { href: '/login', label: 'Login' },
        { href: '/register', label: 'Sign Up' },
      ]

  return (
    <nav
      className="bg-white shadow-md sticky top-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
            aria-label="Spine Aid Home"
          >
            <FiHeart className="h-6 w-6" aria-hidden="true" />
            <span className="text-xl font-bold">Spine Aid</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
                  pathname === link.href && 'text-primary-600 font-semibold'
                )}
              >
                {link.label}
              </Link>
            ))}
            {authLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={link.onClick}
                className={cn(
                  'text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
                  link.href === '/dashboard' && 'bg-primary-50 text-primary-700',
                  link.href === '/register' && 'bg-primary-600 text-white hover:bg-primary-700'
                )}
              >
                {link.icon && <link.icon className="inline mr-2" />}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <FiX className="h-6 w-6" aria-hidden="true" />
            ) : (
              <FiMenu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500',
                  pathname === link.href && 'bg-primary-50 text-primary-600'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-2 mt-2">
              {authLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    setIsOpen(false)
                    if (link.onClick) link.onClick()
                  }}
                  className={cn(
                    'block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500',
                    link.href === '/register' && 'bg-primary-600 text-white hover:bg-primary-700'
                  )}
                >
                  {link.icon && <link.icon className="inline mr-2" />}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

