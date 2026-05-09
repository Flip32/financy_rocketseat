import type { ButtonHTMLAttributes } from 'react'

import type { CategoryColor } from '../../../../../lib/category-color'
import type { UiIconType } from '../icon-tokens'
import { Icon } from '../icon/icon'

type CategoryOptionIconItemProps = {
  iconName: UiIconType
  selected?: boolean
  selectedColor?: CategoryColor
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>

function getClassName(
  selected: boolean,
  selectedColor: CategoryColor,
  className?: string
) {
  return [
    'category-option-icon-item',
    selected ? 'category-option-icon-item--selected' : '',
    selected ? `category-option-icon-item--${selectedColor}` : '',
    className
  ]
    .filter(Boolean)
    .join(' ')
}

export function CategoryOptionIconItem({
  iconName,
  selected = false,
  selectedColor = 'green',
  className,
  ...rest
}: CategoryOptionIconItemProps) {
  return (
    <button
      type="button"
      className={getClassName(selected, selectedColor, className)}
      {...rest}
    >
      <Icon
        icone={iconName}
        size={20}
        className="category-option-icon-item__icon"
      />
    </button>
  )
}
