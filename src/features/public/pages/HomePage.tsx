import { usePageTitle } from '@/hooks/use-page-title'
import { Hero } from '../components/Hero'
import { AboutSection } from '../components/landing/AboutSection'
import { DalilSection } from '../components/landing/DalilSection'
import { DatesSection } from '../components/landing/DatesSection'
import { FaqSection } from '../components/landing/FaqSection'
import { FinalCta } from '../components/landing/FinalCta'
import { ImpactSection } from '../components/landing/ImpactSection'
import { PartnersSection } from '../components/landing/PartnersSection'
import { StepsSection } from '../components/landing/StepsSection'
import { WhoSection } from '../components/landing/WhoSection'
import { WhySection } from '../components/landing/WhySection'
import { TracksSection } from '../components/TracksSection'

/**
 * Home Ready landing (brief C5, sections 2 to 13 in order; header and footer come from the
 * public layout). Each band reveals its title, text and items one by one on scroll.
 */
export function HomePage() {
  usePageTitle('')
  return (
    <>
      <Hero />
      <AboutSection />
      <WhySection />
      <WhoSection />
      <StepsSection />
      <TracksSection />
      <DalilSection />
      <DatesSection />
      <PartnersSection />
      <ImpactSection />
      <FaqSection />
      <FinalCta />
    </>
  )
}
