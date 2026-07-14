import dupplyLogoDark from '../assets/dupply-logo-header.png'
import dupplyLogoLight from '../assets/dupply-logo-transparent.png'
import { useTheme } from '../hooks/useTheme'

interface BrandLogoProps {
  className?: string
  width?: number
  height?: number
}

export function BrandLogo({ className, width = 300, height = 82 }: BrandLogoProps) {
  const { isLight } = useTheme()
  const src = isLight ? dupplyLogoLight : dupplyLogoDark

  return (
    <img
      className={className}
      src={src}
      alt="Dupply"
      width={width}
      height={height}
      decoding="async"
    />
  )
}
