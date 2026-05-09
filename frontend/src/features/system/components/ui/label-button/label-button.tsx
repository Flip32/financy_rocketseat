import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { UiColor } from '../color-tokens'
import type { UiIconType } from '../icon-tokens'
import { Icon } from '../icon/icon'

export type LabelButtonSize = 'Sm' | 'Md'
export type LabelButtonType = 'Default' | 'Hover' | 'Disabled'
export type LabelButtonVariant = 'Solid' | 'Outline'

type LabelButtonProps = {
  size?: LabelButtonSize
  type?: LabelButtonType
  variant?: LabelButtonVariant
  icone?: UiIconType
  iconColor?: UiColor
  iconSize?: number
  htmlType?: 'button' | 'submit' | 'reset'
  children: ReactNode
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>

function getClassName(
  size: LabelButtonSize,
  type: LabelButtonType,
  variant: LabelButtonVariant
) {
  const classes = ['label-button']

  classes.push(size === 'Sm' ? 'label-button--sm' : 'label-button--md')
  classes.push(
    variant === 'Solid' ? 'label-button--solid' : 'label-button--outline'
  )

  if (type === 'Hover') {
    classes.push('label-button--preview-hover')
  }

  return classes.join(' ')
}

function getIconColor(type: LabelButtonType, variant: LabelButtonVariant) {
  if (variant === 'Solid') {
    return UiColor.White
  }

  if (type === 'Disabled') {
    return UiColor.Gray700
  }

  return UiColor.Gray700
}

export function LabelButton({
  size = 'Md',
  type = 'Default',
  variant = 'Solid',
  icone,
  iconSize,
  iconColor,
  htmlType = 'button',
  children,
  className,
  disabled,
  ...rest
}: LabelButtonProps) {
  const isDisabled = disabled || type === 'Disabled'
  const resolvedIconSize = iconSize ?? (size === 'Md' ? 20 : 16)
  const iconLocalColor = iconColor ?? getIconColor(type, variant)
  const resolvedClassName = [getClassName(size, type, variant), className]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={htmlType}
      className={resolvedClassName}
      disabled={isDisabled}
      {...rest}
    >
      {icone ? (
        <Icon
          icone={icone}
          size={resolvedIconSize}
          color={iconLocalColor}
          aria-hidden="true"
        />
      ) : null}
      {children}
    </button>
  )
}
