import type { ButtonHTMLAttributes } from 'react'

import { UiColor } from '../color-tokens'
import type { UiIconType } from '../icon-tokens'
import { Icon } from '../icon/icon'

export type IconButtonType = 'Default' | 'Hover' | 'Disabled' // Type Hover, só serve para visualizar na area de componentes.
export type IconButtonVariant = 'Outline' | 'Danger'

type IconButtonProps = {
  type?: IconButtonType
  variant?: IconButtonVariant
  icone: UiIconType
  iconSize?: number
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'>

function getClassName(variant: IconButtonVariant, type: IconButtonType) {
  const classes = ['icon-button-v2']

  if (variant === 'Danger') {
    classes.push('icon-button-v2--danger')
  } else {
    classes.push('icon-button-v2--outline')
  }

  if (type === 'Hover') {
    classes.push('icon-button-v2--preview-hover')
  }

  return classes.join(' ')
}

function getIconColor(variant: IconButtonVariant, type: IconButtonType) {
  if (type === 'Disabled') {
    return UiColor.Gray400
  }

  if (variant === 'Danger') {
    return UiColor.Danger
  }

  return UiColor.Gray700
}

export function IconButton({
  type = 'Default',
  variant = 'Outline',
  icone,
  iconSize = 14,
  disabled,
  ...rest
}: IconButtonProps) {
  const isDisabled = disabled || type === 'Disabled'
  const iconColor = getIconColor(variant, type)

  return (
    <button
      className={getClassName(variant, type)}
      disabled={isDisabled}
      {...rest}
    >
      <Icon
        icone={icone}
        size={iconSize}
        color={iconColor}
        aria-hidden="true"
      />
    </button>
  )
}

export const IconButon = IconButton
