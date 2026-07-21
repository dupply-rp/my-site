import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { BenefitsSection } from '../components/sections/BenefitsSection'
import { DiagnosticoBanner } from '../components/sections/DiagnosticoBanner'
import { DiagnosisSection } from '../components/sections/DiagnosisSection'
import { FaqSection } from '../components/sections/FaqSection'
import { FinalCtaSection } from '../components/sections/FinalCtaSection'
import { Hero } from '../components/sections/Hero'
import { ProcessSection } from '../components/sections/ProcessSection'
import { TrajectorySection } from '../components/sections/TrajectorySection'
import { FaqJsonLd } from '../components/seo/FaqJsonLd'
import { JsonLd } from '../components/seo/JsonLd'
import { PageMeta } from '../components/seo/PageMeta'
import { SkipLink } from '../components/seo/SkipLink'
import { SITE_DESCRIPTION, SITE_TITLE } from '../constants/site'
import '../styles/landing.css'

export function HomePage() {
  return (
    <>
      <PageMeta title={SITE_TITLE} description={SITE_DESCRIPTION} path="/" />
      <JsonLd />
      <FaqJsonLd />
      <SkipLink />
      <Header />
      <main id="conteudo-principal">
        <div id="top" tabIndex={-1} />
        <Hero />
        <DiagnosisSection />
        <DiagnosticoBanner />
        <TrajectorySection />
        <ProcessSection />
        <BenefitsSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  )
}
