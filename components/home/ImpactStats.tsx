import { FiUsers, FiPackage, FiHeart, FiMapPin } from 'react-icons/fi'

const stats = [
  {
    icon: FiUsers,
    value: '1,250+',
    label: 'Active Community Members',
    description: 'Donors and recipients working together',
  },
  {
    icon: FiPackage,
    value: '3,500+',
    label: 'Items Donated',
    description: 'Wheelchairs, mobility aids, and supplies',
  },
  {
    icon: FiHeart,
    value: '850+',
    label: 'Lives Impacted',
    description: 'Individuals receiving essential support',
  },
  {
    icon: FiMapPin,
    value: '42',
    label: 'Cities Served',
    description: 'Communities across the country',
  },
]

export function ImpactStats() {
  return (
    <section className="py-16 bg-gray-50" aria-label="Impact statistics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Our Impact
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Numbers that reflect the power of community and compassion
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-primary-500"
                tabIndex={0}
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-primary-100 p-3 rounded-full">
                    <Icon className="h-8 w-8 text-primary-600" aria-hidden="true" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.description}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

