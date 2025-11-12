import Link from 'next/link'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white text-lg font-semibold mb-4">About Spine Aid</h3>
            <p className="text-sm mb-4">
              Spine Aid is an India-first, globally connected platform that channels mobility aids,
              orthotics, and rehab supplies to people living with spinal cord injuries in every state.
              We collaborate with hospitals, NGOs, and diaspora champions worldwide.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <FiMail className="h-4 w-4" aria-hidden="true" />
                <a
                  href="mailto:hello@spineaid.in"
                  className="hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                >
                  hello@spineaid.in
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <FiPhone className="h-4 w-4" aria-hidden="true" />
                <a
                  href="tel:+918061337788"
                  className="hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                >
                  +91 80613 37788
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <FiMapPin className="h-4 w-4" aria-hidden="true" />
                <span>
                  Bengaluru, India &middot; Global Operations Desk
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/volunteer"
                  className="hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                >
                  Volunteer
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Stay Connected</h3>
            <p className="text-sm mb-4">Subscribe to our newsletter for updates and stories.</p>
            <form
              action="/api/newsletter/subscribe"
              method="POST"
              className="space-y-2"
              aria-label="Newsletter subscription"
            >
              <input
                type="email"
                name="email"
                placeholder="Your email"
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Spine Aid. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <Link
              href="/privacy"
              className="hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
