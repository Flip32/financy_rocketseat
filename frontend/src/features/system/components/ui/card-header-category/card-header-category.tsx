import type { ReactNode } from 'react'

import { UiColor, type UiColorType } from '../color-tokens'
import type { UiIconType } from '../icon-tokens'
import { Icon } from '../icon/icon'

type CardHeaderCategoryProps = {
  iconName: UiIconType
  value: ReactNode
  title: string
  iconColor?: UiColorType
  className?: string
}

export function CardHeaderCategory({
  iconName,
  value,
  title,
  iconColor = UiColor.Gray700,
  className
}: CardHeaderCategoryProps) {
  const resolvedClassName = ['surface card-header-category', className]
    .filter(Boolean)
    .join(' ')

  return (
    <article className={resolvedClassName}>
      <div className="card-header-category__head">
        <Icon
          icone={iconName}
          size={24}
          color={iconColor}
          aria-hidden="true"
          className="card-header-category__icon"
        />
        <strong className="card-header-category__value">{value}</strong>
      </div>

      <p className="card-header-category__title">{title}</p>
    </article>
  )
}
