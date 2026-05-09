import type { FormEvent } from 'react'

import { Modal } from '../../system/components/modal'
import {
  Button,
  Icon,
  Input,
  LabelButton,
  UiColor,
  UiIcon
} from '../../system/components/ui'
import type { TransactionType } from '../types/transaction'

import './transaction-form-modal.css'

export type TransactionFormErrors = {
  title?: string
  occurredAt?: string
  amount?: string
  categoryId?: string
  general?: string
}

type TransactionFormModalProps = {
  open: boolean
  title: string
  mutationLoading: boolean
  formData: {
    title: string
    amount: string
    type: TransactionType
    occurredAt: string
    categoryId: string
  }
  categoryOptions: Array<{
    label: string
    value: string
  }>
  formErrors: TransactionFormErrors
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onTypeChange: (value: TransactionType) => void
  onTitleChange: (value: string) => void
  onOccurredAtChange: (value: string) => void
  onAmountChange: (value: string) => void
  onCategoryChange: (value: string) => void
}

export function TransactionFormModal({
  open,
  title,
  mutationLoading,
  formData,
  categoryOptions,
  formErrors,
  onClose,
  onSubmit,
  onTypeChange,
  onTitleChange,
  onOccurredAtChange,
  onAmountChange,
  onCategoryChange
}: TransactionFormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle="Registre sua despesa ou receita"
      className="modal--transaction-form"
    >
      <form onSubmit={onSubmit} className="transaction-form-modal__content">
        <fieldset className="transaction-form-modal__type-switch">
          <Button
            type={formData.type === 'EXPENSE' ? 'Active' : 'Default'}
            className="transaction-form-modal__type-button transaction-form-modal__type-button--expense"
            onClick={() => onTypeChange('EXPENSE')}
          >
            <Icon
              icone={UiIcon.CircleArrowDown}
              size={20}
              color={
                formData.type === 'EXPENSE' ? UiColor.RedBase : UiColor.Gray400
              }
              aria-hidden="true"
            />
            Despesa
          </Button>

          <Button
            type={formData.type === 'INCOME' ? 'Active' : 'Default'}
            className="transaction-form-modal__type-button transaction-form-modal__type-button--income"
            onClick={() => onTypeChange('INCOME')}
          >
            <Icon
              icone={UiIcon.CircleArrowUp}
              size={20}
              color={
                formData.type === 'INCOME' ? UiColor.GreenBase : UiColor.Gray400
              }
              aria-hidden="true"
            />
            Receita
          </Button>
        </fieldset>

        <div className="transaction-form-modal__fields">
          <Input
            label="Descrição"
            type={formData.title ? 'Filled' : 'Empty'}
            value={formData.title}
            onValueChange={onTitleChange}
            placeholder="Ex. Almoço no restaurante"
            errorMessage={formErrors.title}
          />

          <div className="transaction-form-modal__row">
            <Input
              label="Data"
              type="Filled"
              value={formData.occurredAt}
              onValueChange={onOccurredAtChange}
              inputType="datetime-local"
              errorMessage={formErrors.occurredAt}
            />

            <Input
              label="Valor"
              type={formData.amount ? 'Filled' : 'Empty'}
              value={formData.amount}
              onValueChange={onAmountChange}
              inputType="text"
              inputMode="decimal"
              leftIcon={
                <span className="transaction-form-modal__currency-prefix">
                  R$
                </span>
              }
              placeholder="0,00"
              errorMessage={formErrors.amount}
            />
          </div>

          <Input
            label="Categoria"
            type="Select"
            value={formData.categoryId}
            onValueChange={onCategoryChange}
            options={categoryOptions}
            errorMessage={formErrors.categoryId}
          />
        </div>

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
