import Link from 'next/link'
import { FiArrowRight, FiHeart } from 'react-icons/fi'

export function CallToAction() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FiHeart className="h-16 w-16 mx-auto mb-6 text-white opacity-80" aria-hidden="true" />
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ready to Make a Difference?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join our community today. Whether you have items to donate or need support,
          we're here to help connect you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register?role=donor"
            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-colors focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 inline-flex items-center justify-center"
          >
            Become a Donor
            <FiArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </Link>
          <Link
            href="/register?role=recipient"
            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-colors focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
          >
            Request Support
          </Link>
        </div>
      </div>
    </section>
  )
}

