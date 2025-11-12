import Link from 'next/link'
import { FiArrowRight, FiHeart } from 'react-icons/fi'

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <FiHeart className="h-16 w-16 text-primary-200" aria-hidden="true" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            India&rsquo;s Spine Aid Network
            <span className="block text-primary-100">Built for Bharat, Welcoming the World</span>
          </h1>
          <p className="text-xl sm:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
            We coordinate wheelchairs, mobility aids, and rehab supplies across India while giving
            global donors, hospitals, and diaspora families a trusted way to support every district.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-colors focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 inline-flex items-center justify-center"
            >
              Get Started
              <FiArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              href="/about"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-colors focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

