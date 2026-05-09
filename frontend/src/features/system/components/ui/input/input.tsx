import type {
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  ReactNode
} from 'react'
import { useId } from 'react'

import { UiIcon } from '../icon-tokens'
import { Icon } from '../icon/icon'

type InputVariant =
  | 'Empty'
  | 'Active'
  | 'Filled'
  | 'Error'
  | 'Disabled'
  | 'Select'

type InputOption = {
  label: string
  value: string
}

type InputProps = {
  label: string
  type?: InputVariant
  helper?: string
  errorMessage?: string
  value: string
  onValueChange?: (value: string) => void
  placeholder?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  onRightIconClick?: () => void
  rightIconAriaLabel?: string
  inputType?: HTMLInputTypeAttribute
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode']
  options?: InputOption[]
  required?: boolean
  minLength?: number
  min?: number | string
  step?: number | string
  name?: string
  id?: string
  disabled?: boolean
}

function getLabelClass(type: InputVariant) {
  if (type === 'Active') {
    return 'field-label field-label--active'
  }

  if (type === 'Error') {
    return 'field-label field-label--error'
  }

  if (type === 'Disabled') {
    return 'field-label field-label--disabled'
  }

  return 'field-label'
}

function getFieldClass(
  type: InputVariant,
  hasLeftIcon: boolean,
  hasError: boolean
) {
  const classes = ['field']

  if (hasLeftIcon) {
    classes.push('field--with-icon')
  }

  if (type === 'Select') {
    classes.push('field--select')
  }

  if (type === 'Active') {
    classes.push('field--preview-active')
  }

  if (type === 'Error' || hasError) {
    classes.push('field--error')
  }

  return classes.join(' ')
}

function getIconToneClass(type: InputVariant, isDisabled: boolean) {
  if (isDisabled) {
    return 'field-icon-tone--disabled'
  }

  if (type === 'Empty') {
    return 'field-icon-tone--empty'
  }

  if (type === 'Active') {
    return 'field-icon-tone--active'
  }

  if (type === 'Error') {
    return 'field-icon-tone--error'
  }

  return 'field-icon-tone--filled'
}

export function Input({
  label,
  type = 'Filled',
  helper,
  errorMessage,
  value,
  onValueChange,
  placeholder,
  leftIcon,
  rightIcon,
  onRightIconClick,
  rightIconAriaLabel,
  inputType = 'text',
  inputMode,
  options = [],
  required,
  minLength,
  min,
  step,
  name,
  id,
  disabled = false
}: InputProps) {
  const generatedId = useId()
  const controlId = id ?? `${generatedId}-${name ?? 'field'}`
  const normalizedErrorMessage = errorMessage?.trim() ?? ''
  const hasError = normalizedErrorMessage.length > 0
  const resolvedType: InputVariant = hasError ? 'Error' : type
  const helperText = hasError ? normalizedErrorMessage : helper
  const helperTextId = helperText ? `${controlId}-helper` : undefined
  const isSelect = type === 'Select'
  const isDisabled = disabled || type === 'Disabled'
  const hasLeftIcon = Boolean(leftIcon)
  const hasRightIcon = Boolean(rightIcon) && !isSelect
  const labelClassName = getLabelClass(resolvedType)
  const fieldClassName = getFieldClass(type, hasLeftIcon, hasError)
  const iconToneClassName = getIconToneClass(resolvedType, isDisabled)

  const controlClassName = isSelect
    ? hasLeftIcon
      ? 'field-with-icon field-with-right-icon'
      : 'field-with-right-icon'
    : hasLeftIcon && hasRightIcon
      ? 'field-with-icon field-with-right-icon'
      : hasLeftIcon
        ? 'field-with-icon'
        : hasRightIcon
          ? 'field-with-right-icon'
          : ''

  return (
    <div className="field-wrap">
      <label htmlFor={controlId} className={labelClassName}>
        {label}
      </label>

      <div className={controlClassName || undefined}>
        {hasLeftIcon ? (
          <span
            className={`field-left-icon ${iconToneClassName}`}
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        ) : null}

        {isSelect ? (
          <>
            <select
              id={controlId}
              name={name}
              value={value}
              onChange={event => onValueChange?.(event.target.value)}
              className={fieldClassName}
              disabled={isDisabled}
              required={required}
              aria-invalid={hasError}
              aria-describedby={helperTextId}
            >
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <Icon
              icone={UiIcon.ChevronDown}
              size={14}
              aria-hidden="true"
              className={`field-right-icon ${iconToneClassName}`}
            />
          </>
        ) : (
          <>
            <input
              id={controlId}
              name={name}
              type={inputType}
              inputMode={inputMode}
              value={value}
              onChange={event => onValueChange?.(event.target.value)}
              placeholder={placeholder}
              className={fieldClassName}
              required={required}
              minLength={minLength}
              min={min}
              step={step}
              disabled={isDisabled}
              aria-invalid={hasError}
              aria-describedby={helperTextId}
            />
            {hasRightIcon ? (
              onRightIconClick ? (
                <button
                  type="button"
                  className={`field-right-icon field-icon-button ${iconToneClassName}`}
                  onClick={onRightIconClick}
                  aria-label={rightIconAriaLabel ?? 'Ação do campo'}
                  tabIndex={isDisabled ? -1 : 0}
                  disabled={isDisabled}
                >
                  {rightIcon}
                </button>
              ) : (
                <span
                  className={`field-right-icon field-right-icon--static ${iconToneClassName}`}
                  aria-hidden="true"
                >
                  {rightIcon}
                </span>
              )
            ) : null}
          </>
        )}
      </div>

      {helperText ? (
        <span
          id={helperTextId}
          className={`helper-text ${hasError ? 'helper-text--error' : ''}`}
        >
          {helperText}
        </span>
      ) : null}
    </div>
  )
}
