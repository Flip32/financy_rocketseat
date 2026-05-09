import type { InputHTMLAttributes, ReactNode } from 'react'
import { useId } from 'react'

type CheckBoxProps = {
  checked: boolean
  onCheckedChange?: (checked: boolean) => void
  children?: ReactNode
  className?: string
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'checked' | 'onChange' | 'children'
>

export function CheckBox({
  checked,
  onCheckedChange,
  children,
  className,
  id,
  disabled,
  ...rest
}: CheckBoxProps) {
  const generatedId = useId()
  const controlId = id ?? `${generatedId}-checkbox`
  const resolvedClassName = [
    'check-box',
    disabled && 'check-box--disabled',
    className
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <label htmlFor={controlId} className={resolvedClassName}>
      <input
        id={controlId}
        type="checkbox"
        checked={checked}
        onChange={event => onCheckedChange?.(event.target.checked)}
        className="check-box__input"
        disabled={disabled}
        {...rest}
      />
      <span className="check-box__control" aria-hidden="true" />
      {children ? <span className="check-box__label">{children}</span> : null}
    </label>
  )
}
