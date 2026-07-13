import itauLogo from '../assets/companies/itau.svg'
import santanderLogo from '../assets/companies/santander.svg'
import neonLogo from '../assets/companies/neon.svg'
import toroLogo from '../assets/companies/toro.svg'
import toroLogoLight from '../assets/companies/toro-light.svg'
import pravalerLogo from '../assets/companies/pravaler.webp'
import claroLogo from '../assets/companies/claro.svg'
import boticarioLogo from '../assets/companies/boticario.png'
import rdstationLogo from '../assets/companies/rdstation.svg'
import rdstationLogoLight from '../assets/companies/rdstation-light.svg'
import totvsLogo from '../assets/companies/totvs.svg'
import totvsLogoLight from '../assets/companies/totvs-light.svg'
import type { CompanyId } from '../constants/content'
import { useTheme } from '../hooks/useTheme'

interface CompanyIconProps {
  id: CompanyId
  variant?: 'inline' | 'tile'
}

const logos: Record<CompanyId, string> = {
  itau: itauLogo,
  santander: santanderLogo,
  neon: neonLogo,
  toro: toroLogo,
  pravaler: pravalerLogo,
  claro: claroLogo,
  boticario: boticarioLogo,
  rdstation: rdstationLogo,
  totvs: totvsLogo,
}

const markIds = new Set<CompanyId>(['boticario', 'itau', 'santander'])
const wideIds = new Set<CompanyId>(['totvs', 'rdstation', 'toro', 'neon', 'pravaler'])

const themeAwareIds = new Set<CompanyId>(['toro', 'totvs', 'rdstation'])

export function CompanyIcon({ id, variant = 'inline' }: CompanyIconProps) {
  const { isLight } = useTheme()

  let src = logos[id]
  if (themeAwareIds.has(id) && !isLight) {
    if (id === 'toro') src = toroLogoLight
    if (id === 'totvs') src = totvsLogoLight
    if (id === 'rdstation') src = rdstationLogoLight
  }

  const baseClass = variant === 'tile' ? 'company-logo' : 'company-icon'
  const modifiers = [
    markIds.has(id) ? `${baseClass}--mark` : '',
    wideIds.has(id) ? `${baseClass}--wide` : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <img
      src={src}
      alt=""
      className={[baseClass, modifiers].filter(Boolean).join(' ')}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  )
}
