import type { LucideProps } from 'lucide-react'

import { type UiColorType, toCssColorVar } from '../color-tokens'
import { UI_ICON_COMPONENTS, type UiIconType } from '../icon-tokens'

type IconProps = Omit<LucideProps, 'color'> & {
  icone: UiIconType
  color?: UiColorType
}

export function Icon({ icone, color, ...rest }: IconProps) {
  const IconComponent = UI_ICON_COMPONENTS[icone]
  const resolvedColor = color ? toCssColorVar(color) : undefined

  return <IconComponent color={resolvedColor} {...rest} />
}

export const Icone = Icon
