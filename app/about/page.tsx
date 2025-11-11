import { FiHeart, FiUsers, FiTarget, FiShield } from 'react-icons/fi'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">About Spine Aid</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Connecting communities to provide essential support for those affected by spinal cord injuries
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <FiHeart className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Spine Aid is dedicated to raising awareness about spinal cord injuries while
              facilitating the coordination of in-kind donations. We believe that everyone
              deserves access to mobility aids and medical supplies, regardless of their
              financial situation.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiHeart className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Compassion</h3>
              <p className="text-gray-600">
                We approach every interaction with empathy and understanding
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiUsers className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                We believe in the power of communities coming together
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiTarget className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparency</h3>
              <p className="text-gray-600">
                We maintain open and honest communication in all our operations
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiShield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trust</h3>
              <p className="text-gray-600">
                We build trust through verified profiles and secure processes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How We Work</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Profiles</h3>
              <p className="text-gray-600">
                All donors and recipients go through a verification process to ensure
                the safety and security of our community.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Money Handling</h3>
              <p className="text-gray-600">
                We focus exclusively on in-kind donations. No money changes hands,
                ensuring transparency and trust in every transaction.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Status Tracking</h3>
              <p className="text-gray-600">
                Every donation is tracked from offer to delivery, providing full
                visibility into the donation process.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Support</h3>
              <p className="text-gray-600">
                Our platform facilitates direct communication between donors and
                recipients, building lasting community connections.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

