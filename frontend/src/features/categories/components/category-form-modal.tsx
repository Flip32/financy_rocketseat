import type { FormEvent } from 'react'

import { Modal } from '../../system/components/modal'
import {
  CategoryOptionIconItem,
  Input,
  LabelButton,
  type UiIcon
} from '../../system/components/ui'
import {
  CATEGORY_COLOR_OPTIONS,
  CATEGORY_ICON_OPTIONS,
  type CategoryColor,
  type CategoryIcon
} from '../lib/category-visuals'

import './category-form-modal.css'

export type CategoryFormData = {
  name: string
  description: string
  icon: CategoryIcon
  color: CategoryColor
}

export type CategoryFormErrors = Partial<
  Record<keyof CategoryFormData, string>
> & {
  general?: string
}

type CategoryFormModalProps = {
  open: boolean
  title: string
  mutationLoading: boolean
  formData: CategoryFormData
  formErrors: CategoryFormErrors
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onFormChange: <K extends keyof CategoryFormData>(
    key: K,
    value: CategoryFormData[K]
  ) => void
}

export function CategoryFormModal({
  open,
  title,
  mutationLoading,
  formData,
  formErrors,
  onClose,
  onSubmit,
  onFormChange
}: CategoryFormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle="Organize suas transações com categorias"
      className="modal--category"
    >
      <form onSubmit={onSubmit} className="category-form-grid">
        <Input
          label="Título"
          type={formData.name ? 'Filled' : 'Empty'}
          value={formData.name}
          onValueChange={value => onFormChange('name', value)}
          placeholder="Ex. Alimentação"
          errorMessage={formErrors.name}
        />

        <Input
          label="Descrição"
          type={formData.description ? 'Filled' : 'Empty'}
          value={formData.description}
          onValueChange={value => onFormChange('description', value)}
          placeholder="Descrição da categoria"
          helper="Opcional"
          errorMessage={formErrors.description}
        />

        <fieldset className="fieldset">
          <legend className="field-label">Ícone</legend>
          <div className="icon-grid">
            {CATEGORY_ICON_OPTIONS.map(option => {
              const selected = formData.icon === option.key

              return (
                <CategoryOptionIconItem
                  key={option.key}
                  iconName={option.key as UiIcon}
                  selected={selected}
                  selectedColor={formData.color}
                  onClick={() => onFormChange('icon', option.key)}
                  aria-label={option.label}
                  aria-pressed={selected}
                />
              )
            })}
          </div>
          {formErrors.icon ? (
            <span className="helper-text helper-text--error">
              {formErrors.icon}
            </span>
          ) : null}
        </fieldset>

        <fieldset className="fieldset">
          <legend className="field-label">Cor</legend>
          <div className="color-grid">
            {CATEGORY_COLOR_OPTIONS.map(option => {
              const selected = formData.color === option.key

              return (
                <button
                  key={option.key}
                  type="button"
                  className={`color-chip color-chip--${option.key} ${
                    selected ? 'color-chip--active' : ''
                  }`}
                  onClick={() => onFormChange('color', option.key)}
                  aria-label={option.label}
                  aria-pressed={selected}
                >
                  <span className="color-chip__swatch" />
                </button>
              )
            })}
          </div>
          {formErrors.color ? (
            <span className="helper-text helper-text--error">
              {formErrors.color}
            </span>
          ) : null}
        </fieldset>

        {formErrors.general ? (
          <p className="feedback">{formErrors.general}</p>
        ) : null}

        <div className="modal__actions modal__actions--single">
          <LabelButton
            size="Md"
            type={mutationLoading ? 'Disabled' : 'Default'}
            disabled={mutationLoading}
            htmlType="submit"
          >
            {mutationLoading ? 'Salvando...' : 'Salvar'}
          </LabelButton>
        </div>
      </form>
    </Modal>
  )
}
