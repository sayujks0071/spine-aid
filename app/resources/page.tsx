import Link from 'next/link'
import { FiExternalLink, FiBook, FiVideo, FiFileText, FiUsers } from 'react-icons/fi'

const resources = [
  {
    category: 'Clinical',
    title: 'ISIC Patient & Caregiver Handbook',
    description: 'Protocols from the Indian Spinal Injuries Centre covering rehab routines, pressure sore care, and nutrition.',
    type: 'Guide',
    icon: FiBook,
    link: 'https://www.isiconline.org/patients-caregivers/',
  },
  {
    category: 'Community',
    title: 'Spinal Foundation Peer Circles',
    description: 'Nationwide peer mentors and WhatsApp groups for families navigating SCI in English and Indian languages.',
    type: 'Directory',
    icon: FiUsers,
    link: 'https://www.spinalfoundation.in/peer-support/',
  },
  {
    category: 'Policy',
    title: 'Department of Empowerment of PwDs Schemes',
    description: 'Government programs, ADIP subsidies, and travel concessions for assistive devices across India.',
    type: 'Portal',
    icon: FiFileText,
    link: 'https://depwd.gov.in/',
  },
  {
    category: 'Global Standard',
    title: 'WHO Wheelchair Service Training Package',
    description: 'International guidelines that our partners follow for assessment, fitting, and follow-up care.',
    type: 'Toolkit',
    icon: FiVideo,
    link: 'https://www.who.int/publications/i/item/9789241547482',
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
              Access to rehab knowledge and assistive devices is still uneven across Indian states.
              Curated, trustworthy resources help caregivers advocate for subsidies, pick safe
              equipment, and stay connected with professionals worldwide.
            </p>
            <p className="text-gray-600">
              Have a guide in Marathi, a webinar from Singapore, or policy news to share? Send it to
              us so we can publish it for the wider community.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
