'use client'

import { useState, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight, FiMessageSquare } from 'react-icons/fi'

const stories = [
  {
    id: 1,
    name: 'Ananya Rao',
    role: 'Recipient',
    location: 'Bengaluru, India',
    quote:
      'Within a week of registering, I was matched to a lightweight wheelchair that fits narrow Bengaluru lanes. Knowing donors from across India care has rebuilt my confidence.',
    image: '/api/placeholder/150/150',
  },
  {
    id: 2,
    name: 'Karan Mehta',
    role: 'Donor & CSR Lead',
    location: 'Mumbai, India',
    quote:
      'We redirect gently used therapy equipment from our clinics via Spine Aid. The platform verifies recipients and gives us CSR-ready documentation without extra overhead.',
    image: '/api/placeholder/150/150',
  },
  {
    id: 3,
    name: 'Dr. Leila Hassan',
    role: 'Rehab Partner',
    location: 'Dubai, UAE',
    quote:
      'Our Gulf-based community wanted to support Indian patients meaningfully. Spine Aid handles customs guidance and last-mile partners so overseas donations remain stress-free.',
    image: '/api/placeholder/150/150',
  },
  {
    id: 4,
    name: 'Maya Patel',
    role: 'Diaspora Donor',
    location: 'London, UK',
    quote:
      'Sending adaptive devices from the UK to a hospital in Ahmedabad felt simple. Tracking updates and multilingual support made our family trust the process completely.',
    image: '/api/placeholder/150/150',
  },
]

export function StoriesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stories.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const currentStory = stories[currentIndex]

  return (
    <section className="py-16 bg-primary-50" aria-label="Community stories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Stories from Our Community
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real experiences from donors and recipients making a difference together
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 relative">
            <FiMessageSquare className="h-12 w-12 text-primary-200 absolute top-4 left-4" aria-hidden="true" />
            
            <div className="text-center">
              <p className="text-xl md:text-2xl text-gray-700 mb-8 italic relative z-10">
                &ldquo;{currentStory.quote}&rdquo;
              </p>
              
              <div className="flex items-center justify-center space-x-4">
                <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-bold text-lg">
                    {currentStory.name.charAt(0)}
                  </span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{currentStory.name}</div>
                  <div className="text-sm text-gray-600">{currentStory.role}</div>
                  <div className="text-sm text-gray-500">{currentStory.location}</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={goToPrevious}
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                aria-label="Previous story"
              >
                <FiChevronLeft className="h-6 w-6 text-gray-700" />
              </button>

              <div className="flex space-x-2" role="tablist" aria-label="Story navigation">
                {stories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      index === currentIndex
                        ? 'w-8 bg-primary-600'
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to story ${index + 1}`}
                    aria-selected={index === currentIndex}
                    role="tab"
                  />
                ))}
              </div>

              <button
                onClick={goToNext}
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                aria-label="Next story"
              >
                <FiChevronRight className="h-6 w-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
