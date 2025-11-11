import Link from 'next/link'
import { Hero } from '@/components/home/Hero'
import { ImpactStats } from '@/components/home/ImpactStats'
import { StoriesCarousel } from '@/components/home/StoriesCarousel'
import { HowItWorks } from '@/components/home/HowItWorks'
import { CallToAction } from '@/components/home/CallToAction'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <ImpactStats />
      <HowItWorks />
      <StoriesCarousel />
      <CallToAction />
    </div>
  )
}

