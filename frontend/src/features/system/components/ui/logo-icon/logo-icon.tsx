import type { ImgHTMLAttributes } from 'react'

import brandLogoIcon from '../../../../../assets/branding/logo-icon.png'

type LogoIconProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>

export function LogoIcon(rest: LogoIconProps) {
  return <img src={brandLogoIcon} {...rest} alt="Financy" />
}
