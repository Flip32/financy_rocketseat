import { UiIcon } from '../icon-tokens'
import { Icon } from '../icon/icon'
import { Input } from '../input/input'

type TransactionMenuOption = {
  label: string
  value: string
}

type TransactionMenuProps = {
  searchValue: string
  onSearchValueChange: (value: string) => void
  typeValue: string
  onTypeValueChange: (value: string) => void
  typeOptions: TransactionMenuOption[]
  categoryValue: string
  onCategoryValueChange: (value: string) => void
  categoryOptions: TransactionMenuOption[]
  periodValue: string
  onPeriodValueChange: (value: string) => void
  periodOptions: TransactionMenuOption[]
  className?: string
}

export function TransactionMenu({
  searchValue,
  onSearchValueChange,
  typeValue,
  onTypeValueChange,
  typeOptions,
  categoryValue,
  onCategoryValueChange,
  categoryOptions,
  periodValue,
  onPeriodValueChange,
  periodOptions,
  className
}: TransactionMenuProps) {
  const resolvedClassName = ['surface transaction-menu', className]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={resolvedClassName}>
      <Input
        label="Buscar"
        type={searchValue ? 'Filled' : 'Empty'}
        value={searchValue}
        onValueChange={onSearchValueChange}
        placeholder="Buscar por descrição"
        leftIcon={<Icon icone={UiIcon.Search} size={16} aria-hidden="true" />}
      />

      <Input
        label="Tipo"
        type="Select"
        value={typeValue}
        onValueChange={onTypeValueChange}
        options={typeOptions}
      />

      <Input
        label="Categoria"
        type="Select"
        value={categoryValue}
        onValueChange={onCategoryValueChange}
        options={categoryOptions}
      />

      <Input
        label="Período"
        type="Select"
        value={periodValue}
        onValueChange={onPeriodValueChange}
        options={periodOptions}
      />
    </section>
  )
}
