import { Hero } from '@/components/home/Hero'
import { ImpactStats } from '@/components/home/ImpactStats'
import { MissionVideo } from '@/components/home/MissionVideo'
import { GoodSamaritan } from '@/components/home/GoodSamaritan'
import { GiveOrVolunteer } from '@/components/home/GiveOrVolunteer'
import { HowItWorks } from '@/components/home/HowItWorks'
import { StoriesCarousel } from '@/components/home/StoriesCarousel'
import { CallToAction } from '@/components/home/CallToAction'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <ImpactStats />
      <MissionVideo />
      <GoodSamaritan />
      <GiveOrVolunteer />
      <HowItWorks />
      <StoriesCarousel />
      <CallToAction />
    </div>
  )
}
