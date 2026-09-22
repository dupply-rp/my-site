import { Link } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { PageMeta } from '../components/seo/PageMeta'
import { SkipLink } from '../components/seo/SkipLink'
import { DIAGNOSTICO_PATH } from '../constants/links'
import { NOT_FOUND_SEO } from '../constants/seo'
import '../styles/landing.css'
import '../styles/home.css'

export function NotFoundPage() {
  return (
    <>
      <PageMeta route={NOT_FOUND_SEO} />
      <SkipLink />
      <Header />
      <main id="conteudo-principal" className="legal-page">
        <div className="wrap legal-wrap">
          <h1>Página não encontrada</h1>
          <p>O endereço que você acessou não existe ou foi movido.</p>
          <p>
            Volte para a <Link to="/">página inicial</Link> ou comece o{' '}
            <Link to={DIAGNOSTICO_PATH}>diagnóstico gratuito</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
