import Link from 'next/link'
import { FiUsers, FiHeart, FiCheckCircle, FiArrowRight } from 'react-icons/fi'

const volunteerOpportunities = [
  {
    title: 'Regional Logistics Champion',
    description: 'Coordinate pickups with hospitals, self-help groups, and courier partners across your Indian city.',
    timeCommitment: '3-5 hours/week',
  },
  {
    title: 'Translation & Accessibility',
    description: 'Localize onboarding flows, medical instructions, and outreach materials into Indian languages.',
    timeCommitment: '2-3 hours/week',
  },
  {
    title: 'Diaspora Donation Concierge',
    description: 'Support overseas donors with customs paperwork, impact stories, and CSR-ready reporting.',
    timeCommitment: '2-4 hours/week',
  },
  {
    title: 'Clinical Content Studio',
    description: 'Curate rehab tips, mental health resources, and adaptive device explainers with our medical board.',
    timeCommitment: 'Flexible',
  },
]

export default function VolunteerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FiHeart className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Volunteer with Spine Aid India</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Help us bridge donors, hospitals, and recipients across India while welcoming support
            from friends of the community worldwide.
          </p>
        </div>
      </section>

      {/* Why Volunteer Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Volunteer?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your time and skills keep our grassroots logistics, translations, and donor relations
              responsive to India&rsquo;s diverse realities and globally trusted.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <FiUsers className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Build Community</h3>
              <p className="text-gray-600">
                Connect with self-help groups, rehab centres, and diaspora partners focused on SCI care.
              </p>
            </div>
            <div className="text-center">
              <FiHeart className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Make an Impact</h3>
              <p className="text-gray-600">
                Watch equipment move faster to remote districts and celebrate transparent handovers.
              </p>
            </div>
            <div className="text-center">
              <FiCheckCircle className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gain Experience</h3>
              <p className="text-gray-600">
                Learn hands-on CSR reporting, humanitarian logistics, and inclusive communications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Volunteer Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {volunteerOpportunities.map((opportunity, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{opportunity.title}</h3>
                <p className="text-gray-600 mb-4">{opportunity.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Time commitment: {opportunity.timeCommitment}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join our volunteer team and ensure every assistive device offered in India finds the
            right home with dignity and speed.
          </p>
          <Link
            href="/register?role=volunteer"
            className="inline-flex items-center bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-colors focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
          >
            Become a Volunteer
            <FiArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
