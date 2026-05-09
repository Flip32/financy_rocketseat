import type { ButtonHTMLAttributes, ReactNode } from 'react'

type PaginationButtonType = 'Default' | 'Hover' | 'Active' | 'Disabled'

type PaginationButtonProps = {
  type?: PaginationButtonType
  children: ReactNode
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>

function getClassName(type: PaginationButtonType) {
  const classes = ['pagination-button']

  if (type === 'Active') {
    classes.push('pagination-button--active')
  }

  if (type === 'Hover') {
    classes.push('pagination-button--preview-hover')
  }

  return classes.join(' ')
}

export function PaginationButton({
  type = 'Default',
  children,
  disabled,
  ...rest
}: PaginationButtonProps) {
  const isDisabled = disabled || type === 'Disabled'

  return (
    <button className={getClassName(type)} disabled={isDisabled} {...rest}>
      {children}
    </button>
  )
}
