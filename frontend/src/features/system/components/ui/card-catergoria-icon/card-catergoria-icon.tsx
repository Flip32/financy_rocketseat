import type { CategoryColor } from '../../../../../lib/category-color'
import type { UiIconType } from '../icon-tokens'
import { Icon } from '../icon/icon'

type CardCategoriaIconProps = {
  color?: CategoryColor
  iconName: UiIconType
  className?: string
}

export function CardCategoriaIcon({
  color = 'gray',
  iconName,
  className
}: CardCategoriaIconProps) {
  const resolvedClassName = [
    'category-icon',
    `category-icon--${color}`,
    className
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={resolvedClassName} aria-hidden="true">
      <Icon icone={iconName} size={16} />
    </span>
  )
}

export const CardCatergoriaIcon = CardCategoriaIcon
