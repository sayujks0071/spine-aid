import { FiUserPlus, FiSearch, FiMessageCircle, FiCheckCircle } from 'react-icons/fi'

const steps = [
  {
    icon: FiUserPlus,
    title: 'Join Our Community',
    description:
      'Sign up as a donor or recipient. Complete your profile verification to get started.',
  },
  {
    icon: FiSearch,
    title: 'Browse & Match',
    description:
      'Donors list available items with photos and details. Recipients browse and request what they need.',
  },
  {
    icon: FiMessageCircle,
    title: 'Coordinate Logistics',
    description:
      'Use our messaging system to coordinate pickup, delivery, and handoff details.',
  },
  {
    icon: FiCheckCircle,
    title: 'Complete Delivery',
    description:
      'Track status from offered to delivered. Get confirmation receipts for your donations.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 bg-white" aria-label="How it works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A simple, transparent process connecting those who have with those who need
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={index}
                className="relative"
              >
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-primary-500">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary-100 p-3 rounded-full mr-4">
                      <Icon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                    </div>
                    <div className="text-2xl font-bold text-primary-600">{index + 1}</div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-primary-200 -z-10" style={{ width: 'calc(100% - 3rem)', marginLeft: '1.5rem' }} aria-hidden="true" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

