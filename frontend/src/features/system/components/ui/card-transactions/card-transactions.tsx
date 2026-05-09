import type { CategoryColor } from '../../../../../lib/category-color'

import { formatCurrency } from '../../../../../lib/formatters'

import { CardCategoriaIcon } from '../card-catergoria-icon/card-catergoria-icon'
import { IconButton } from '../icon-button/icon-button'
import { UiIcon, type UiIconType } from '../icon-tokens'
import { Pagination } from '../pagination/pagination'
import { Tag } from '../tag/tag'
import {
  TypeTransaction,
  type TypeTransactionKind
} from '../transaction-type/transaction-type'

export type CardTransactionsItem = {
  id: string
  description: string
  date: string
  categoryLabel: string
  categoryColor: CategoryColor
  categoryIconName: UiIconType
  categoryIconColor: CategoryColor
  type: TypeTransactionKind
  amount: number
}

type CardTransactionsProps = {
  items: readonly CardTransactionsItem[]
  currentPage?: number
  totalPages?: number
  resultsLabel?: string
  className?: string
  onPageChange?: (page: number) => void
  onEditItem?: (item: CardTransactionsItem) => void
  onDeleteItem?: (item: CardTransactionsItem) => void
}

function formatSignedAmount(value: number, type: TypeTransactionKind) {
  const signal = type === 'Income' ? '+ ' : '- '
  return `${signal}${formatCurrency(Math.abs(value))}`
}

export function CardTransactions({
  items,
  currentPage = 1,
  totalPages = 3,
  resultsLabel = '1 a 10 | 27 resultados',
  className,
  onPageChange = () => {},
  onEditItem,
  onDeleteItem
}: CardTransactionsProps) {
  const safeTotalPages = Math.max(1, totalPages)
  const resolvedClassName = ['surface card-transactions', className]
    .filter(Boolean)
    .join(' ')

  return (
    <article className={resolvedClassName}>
      <div className="card-transactions__table-wrap">
        <table className="card-transactions__table">
          <thead>
            <tr>
              <th className="card-transactions__col--description">Descrição</th>
              <th className="card-transactions__col--date">Data</th>
              <th className="card-transactions__col--category">Categoria</th>
              <th className="card-transactions__col--type">Tipo</th>
              <th className="card-transactions__col--value">Valor</th>
              <th className="card-transactions__col--actions">Ações</th>
            </tr>
          </thead>

          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td className="card-transactions__col--description">
                  <div className="card-transactions__description">
                    <CardCategoriaIcon
                      color={item.categoryIconColor}
                      iconName={item.categoryIconName}
                    />
                    <p className="card-transactions__description-text">
                      {item.description}
                    </p>
                  </div>
                </td>

                <td className="card-transactions__col--date">
                  <span className="card-transactions__date-text">
                    {item.date}
                  </span>
                </td>

                <td className="card-transactions__col--category">
                  <div className="card-transactions__category">
                    <Tag category={item.categoryColor}>
                      {item.categoryLabel}
                    </Tag>
                  </div>
                </td>

                <td className="card-transactions__col--type">
                  <div className="card-transactions__type">
                    <TypeTransaction type={item.type} />
                  </div>
                </td>

                <td className="card-transactions__col--value">
                  <strong className="card-transactions__amount">
                    {formatSignedAmount(item.amount, item.type)}
                  </strong>
                </td>

                <td className="card-transactions__col--actions">
                  <div className="card-transactions__actions">
                    <IconButton
                      variant="Danger"
                      icone={UiIcon.Trash}
                      aria-label={`Excluir ${item.description}`}
                      onClick={() => onDeleteItem?.(item)}
                    />

                    <IconButton
                      icone={UiIcon.SquarePen}
                      aria-label={`Editar ${item.description}`}
                      onClick={() => onEditItem?.(item)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="card-transactions__footer">
        <span className="card-transactions__results">{resultsLabel}</span>

        <Pagination
          className="card-transactions__pagination"
          currentPage={currentPage}
          totalPages={safeTotalPages}
          onPageChange={onPageChange}
          maxVisiblePages={5}
        />
      </footer>
    </article>
  )
}
