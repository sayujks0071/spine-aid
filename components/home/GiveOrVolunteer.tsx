import Link from 'next/link'
import { FiBox, FiClock, FiUsers } from 'react-icons/fi'

const goodsNeeds = [
  {
    item: 'Pressure-relief cushions',
    partner: 'Government Medical College',
    details: '30 gel cushions needed for long in-patient stays and home discharges.',
  },
  {
    item: 'Reusable catheters & hygiene kits',
    partner: 'Spinal Foundation Peer Cells',
    details: 'Monthly supply for 45 rural recipients transitioning back home.',
  },
  {
    item: 'Portable ramps',
    partner: 'District Rehab Task Force',
    details: '10 aluminium ramps to make classrooms and polling booths accessible.',
  },
]

const volunteerNeeds = [
  {
    role: 'Physio tele-coach',
    partner: 'Home-based Rehab Collective',
    details: 'Guide families via WhatsApp in multiple Indian languages.',
  },
  {
    role: 'Documentation & CSR liaison',
    partner: 'Donor Circle',
    details: 'Assemble impact decks and receipts for overseas companies.',
  },
  {
    role: 'Translation squad',
    partner: 'Regional Allied NGOs',
    details: 'Convert intake forms into regional languages.',
  },
]

export function GiveOrVolunteer() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-primary-50" aria-labelledby="give-or-volunteer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="give-or-volunteer" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Can you give or share your time?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We spotlight urgent material needs and meaningful volunteer roles every week.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-primary-100">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-primary-100 text-primary-600 mr-3">
                <FiBox className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Can you give?</p>
                <h3 className="text-2xl font-bold text-gray-900">Goods & medical supplies</h3>
              </div>
            </div>

            <div className="space-y-6">
              {goodsNeeds.map((need, index) => (
                <article key={index} className="border border-gray-100 rounded-xl p-4">
                  <p className="text-sm font-semibold text-secondary-600 mb-1">
                    Urgent need #{index + 1}
                  </p>
                  <h4 className="text-xl font-semibold text-gray-900">{need.item}</h4>
                  <p className="text-sm text-gray-500 mb-2">{need.partner}</p>
                  <p className="text-gray-600">{need.details}</p>
                </article>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/dashboard/donations/new"
                className="inline-flex items-center rounded-lg bg-primary-600 px-5 py-3 text-white font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Offer supplies
              </Link>
              <Link
                href="/resources"
                className="inline-flex items-center rounded-lg border border-primary-200 px-5 py-3 text-primary-700 font-semibold hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                View all requests
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-secondary-100">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-secondary-100 text-secondary-600 mr-3">
                <FiClock className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-secondary-600">
                  Do you have time?
                </p>
                <h3 className="text-2xl font-bold text-gray-900">Volunteer opportunities</h3>
              </div>
            </div>

            <div className="space-y-6">
              {volunteerNeeds.map((need, index) => (
                <article key={index} className="border border-gray-100 rounded-xl p-4">
                  <p className="text-sm font-semibold text-secondary-600 mb-1 flex items-center">
                    <FiUsers className="mr-2" aria-hidden="true" />
                    Opportunity #{index + 1}
                  </p>
                  <h4 className="text-xl font-semibold text-gray-900">{need.role}</h4>
                  <p className="text-sm text-gray-500 mb-2">{need.partner}</p>
                  <p className="text-gray-600">{need.details}</p>
                </article>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/volunteer"
                className="inline-flex items-center rounded-lg bg-secondary-600 px-5 py-3 text-white font-semibold hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-secondary-500"
              >
                Become a volunteer
              </Link>
              <Link
                href="/resources"
                className="inline-flex items-center rounded-lg border border-secondary-200 px-5 py-3 text-secondary-700 font-semibold hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-500"
              >
                Explore skill needs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

