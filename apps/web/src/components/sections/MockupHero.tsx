import dupplyLogo from '../../assets/dupply-logo.png'
import heroReference from '../../assets/dupply-hero-reference.png'
import { WHATSAPP_URL } from '../../constants/links'

export function MockupHero() {
  return (
    <section className="mockup-hero" aria-labelledby="hero-heading-desktop">
      <h1 id="hero-heading-desktop" className="sr-only">
        Cansado de promessas sobre IA que nunca funcionam na prática? A Dupply implementa IA para
        resolver problemas reais.
      </h1>
      <div className="mockup-stage">
        <img
          className="hero-reference"
          src={heroReference}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          width={1400}
          height={900}
        />
        <div className="mockup-logo-cover" aria-hidden="true" />
        <a className="mockup-logo" href="#top" aria-label="Dupply — página inicial">
          <img src={dupplyLogo} alt="Dupply" width={224} height={86} />
        </a>
        <a className="hotspot hotspot-solutions" href="#gargalos">
          Soluções
        </a>
        <a className="hotspot hotspot-process" href="#atuacao">
          Processo
        </a>
        <a className="hotspot hotspot-results" href="#beneficios">
          Resultados
        </a>
        <a className="hotspot hotspot-about" href="#trajetoria">
          Sobre
        </a>
        <a className="hotspot hotspot-contact" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          Contato
        </a>
        <a className="hotspot hotspot-top-cta" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          Agendar uma conversa
        </a>
        <a className="hotspot hotspot-primary" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          Quero entender como funciona
        </a>
        <a className="hotspot hotspot-secondary" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          Agendar uma conversa
        </a>
      </div>
    </section>
  )
}
