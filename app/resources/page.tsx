import Link from 'next/link'
import { FiExternalLink, FiBook, FiVideo, FiFileText, FiUsers } from 'react-icons/fi'

const resources = [
  {
    category: 'Educational',
    title: 'Understanding Spinal Cord Injuries',
    description: 'Comprehensive guide to understanding spinal cord injuries, their causes, and impact.',
    type: 'Article',
    icon: FiBook,
    link: '#',
  },
  {
    category: 'Support',
    title: 'Support Groups Directory',
    description: 'Find local and online support groups for individuals and families affected by SCI.',
    type: 'Directory',
    icon: FiUsers,
    link: '#',
  },
  {
    category: 'Medical',
    title: 'Medical Resources',
    description: 'Information about medical care, rehabilitation, and treatment options.',
    type: 'Resource',
    icon: FiFileText,
    link: '#',
  },
  {
    category: 'Video',
    title: 'Educational Videos',
    description: 'Watch videos about living with SCI, adaptive equipment, and community stories.',
    type: 'Video',
    icon: FiVideo,
    link: '#',
  },
]

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Educational Resources</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn more about spinal cord injuries, find support, and access valuable resources
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {resources.map((resource, index) => {
            const Icon = resource.icon
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-primary-600">{resource.category}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <Link
                  href={resource.link}
                  className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                >
                  Learn more <FiExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </div>
            )
          })}
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Information</h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              Spinal cord injuries can have a profound impact on individuals and their families.
              Understanding the condition, available resources, and support networks is crucial
              for navigating this journey.
            </p>
            <p className="text-gray-600">
              If you have resources you'd like to share or questions about spinal cord injuries,
              please don't hesitate to reach out to our community.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

