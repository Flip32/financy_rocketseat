import { UiColor } from '../color-tokens'
import { UiIcon } from '../icon-tokens'
import { Icon } from '../icon/icon'

export type TypeTransactionKind = 'Income' | 'Expense'

type TypeTransactionProps = {
  type: TypeTransactionKind
  className?: string
}

export function TypeTransaction({ type, className }: TypeTransactionProps) {
  const resolvedClassName = ['tx-type', className].filter(Boolean).join(' ')

  if (type === 'Income') {
    return (
      <span className={`${resolvedClassName} tx-type--income`}>
        <Icon
          icone={UiIcon.CircleArrowUp}
          size={16}
          color={UiColor.GreenBase}
          aria-hidden="true"
          className="tx-type__icon"
        />
        <span className="tx-type__label">Entrada</span>
      </span>
    )
  }

  return (
    <span className={`${resolvedClassName} tx-type--expense`}>
      <Icon
        icone={UiIcon.CircleArrowDown}
        size={16}
        color={UiColor.RedBase}
        aria-hidden="true"
        className="tx-type__icon"
      />
      <span className="tx-type__label">Saída</span>
    </span>
  )
}

export const TransactionType = TypeTransaction
