import Link from 'next/link'
import { FiHeart, FiMapPin } from 'react-icons/fi'

const spotlightCases = [
  {
    id: 1,
    title: 'Lightweight wheelchair for college student',
    story:
      'An engineering student needs an ultra-light chair to navigate hostel corridors and crowded buses while staying in school.',
    amount: '₹2.4L for adaptive mobility gear',
    location: 'Southern India',
  },
  {
    id: 2,
    title: 'Therapy supplies for working professional',
    story:
      'After spine surgery, a professional needs a year of medication, braces, and supported physiotherapy to return to work.',
    amount: '₹70K for meds & community physio',
    location: 'Western India',
  },
  {
    id: 3,
    title: 'Accessible bathroom retrofit',
    story:
      'A family is rebuilding a bathroom so their loved one can shower safely at home instead of staying in hospital wards.',
    amount: '₹1.8L for ramps & fittings',
    location: 'Central India',
  },
]

export function GoodSamaritan() {
  return (
    <section className="py-16 bg-white" aria-labelledby="good-samaritan-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
            Let&rsquo;s have a <span className="text-secondary-600">big</span> heart
          </p>
          <h2 id="good-samaritan-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Good Samaritan Spotlight
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Three urgent stories that need generous donors and community champions right now.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {spotlightCases.map((item) => (
            <article
              key={item.id}
              className="flex flex-col h-full rounded-2xl border border-primary-100 shadow-sm hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-primary-500"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center text-sm font-semibold text-primary-600">
                    <FiHeart className="mr-2" aria-hidden="true" />
                    Case #{item.id.toString().padStart(2, '0')}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <FiMapPin className="mr-1" aria-hidden="true" />
                    {item.location}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 flex-1">{item.story}</p>
                <p className="mt-4 text-sm font-semibold text-secondary-600">{item.amount}</p>
              </div>
              <div className="px-6 pb-6">
                <Link
                  href="/register?role=donor"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-primary-600 px-4 py-3 text-white font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Ready to support
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/dashboard/donations"
            className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg px-4 py-2"
          >
            View all community cases
          </Link>
        </div>
      </div>
    </section>
  )
}

