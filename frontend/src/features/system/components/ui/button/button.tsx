import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonType = 'Default' | 'Hover' | 'Active' | 'Disabled'

type ButtonProps = {
  type?: ButtonType
  children: ReactNode
  htmlType?: 'button' | 'submit' | 'reset'
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>

function getClassName(type: ButtonType) {
  const classes = ['button-v2']

  if (type === 'Hover') {
    classes.push('button-v2--preview-hover')
  }

  if (type === 'Active') {
    classes.push('button-v2--active')
  }

  return classes.join(' ')
}

export function Button({
  type = 'Default',
  children,
  htmlType = 'button',
  disabled,
  className,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || type === 'Disabled'
  const resolvedClassName = className
    ? `${getClassName(type)} ${className}`
    : getClassName(type)

  return (
    <button
      type={htmlType}
      className={resolvedClassName}
      disabled={isDisabled}
      {...rest}
    >
      {children}
    </button>
  )
}
