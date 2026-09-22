import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { DiagnosisSection } from '../components/sections/DiagnosisSection'
import { FaqSection } from '../components/sections/FaqSection'
import { FinalCtaSection } from '../components/sections/FinalCtaSection'
import { Hero } from '../components/sections/Hero'
import { MetodoSection } from '../components/sections/MetodoSection'
import { ProcessSection } from '../components/sections/ProcessSection'
import { PromessasSection } from '../components/sections/PromessasSection'
import { SolucoesSection } from '../components/sections/SolucoesSection'
import { TrajectorySection } from '../components/sections/TrajectorySection'
import { FaqJsonLd } from '../components/seo/FaqJsonLd'
import { JsonLd } from '../components/seo/JsonLd'
import { PageMeta } from '../components/seo/PageMeta'
import { SkipLink } from '../components/seo/SkipLink'
import { routeSeo } from '../constants/seo'
import '../styles/landing.css'
import '../styles/home.css'

export function HomePage() {
  return (
    <div className="dp-home">
      <PageMeta route={routeSeo('/')} />
      <JsonLd />
      <FaqJsonLd />
      <SkipLink />
      <Header sobreEscuro />
      <main id="conteudo-principal">
        <div id="top" tabIndex={-1} />
        <Hero />
        <TrajectorySection />
        <MetodoSection />
        <DiagnosisSection />
        <ProcessSection />
        <PromessasSection />
        <SolucoesSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  )
}
