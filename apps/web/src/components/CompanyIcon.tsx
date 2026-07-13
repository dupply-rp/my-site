import itauLogo from '../assets/companies/itau.svg'
import santanderLogo from '../assets/companies/santander.svg'
import neonLogo from '../assets/companies/neon.svg'
import toroLogo from '../assets/companies/toro.svg'
import toroLogoLight from '../assets/companies/toro-light.svg'
import pravalerLogo from '../assets/companies/pravaler.webp'
import claroLogo from '../assets/companies/claro.svg'
import boticarioLogo from '../assets/companies/boticario.png'
import rdstationLogo from '../assets/companies/rdstation.svg'
import totvsLogo from '../assets/companies/totvs.svg'
import type { CompanyId } from '../constants/content'
import { useTheme } from '../hooks/useTheme'

interface CompanyIconProps {
  id: CompanyId
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

export function CompanyIcon({ id }: CompanyIconProps) {
  const { isLight } = useTheme()
  const src = id === 'toro' && !isLight ? toroLogoLight : logos[id]

  return (
    <img
      src={src}
      alt=""
      className="company-icon"
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  )
}
