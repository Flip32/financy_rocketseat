import type { ImgHTMLAttributes } from 'react'

import brandLogo from '../../../../../assets/branding/logo.svg'

type LogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>

export function Logo(rest: LogoProps) {
  return <img src={brandLogo} {...rest} alt="Financy" />
}
