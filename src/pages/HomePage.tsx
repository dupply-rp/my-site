import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { BenefitsSection } from '../components/sections/BenefitsSection'
import { DiagnosisSection } from '../components/sections/DiagnosisSection'
import { FinalCtaSection } from '../components/sections/FinalCtaSection'
import { MockupHero } from '../components/sections/MockupHero'
import { ProcessSection } from '../components/sections/ProcessSection'
import { ResponsiveHero } from '../components/sections/ResponsiveHero'
import { TrajectorySection } from '../components/sections/TrajectorySection'
import { JsonLd } from '../components/seo/JsonLd'
import { SkipLink } from '../components/seo/SkipLink'
import '../styles/landing.css'

export function HomePage() {
  return (
    <>
      <JsonLd />
      <SkipLink />
      <Header />
      <main id="conteudo-principal">
        <div id="top" tabIndex={-1} />
        <MockupHero />
        <ResponsiveHero />
        <DiagnosisSection />
        <TrajectorySection />
        <ProcessSection />
        <BenefitsSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  )
}
