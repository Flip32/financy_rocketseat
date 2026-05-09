import type { CategoryColor } from '../../../../../lib/category-color'

import { formatCurrency } from '../../../../../lib/formatters'

import { UiColor } from '../color-tokens'
import { UiIcon } from '../icon-tokens'
import { Icon } from '../icon/icon'
import { UiLink } from '../link/link'
import { Tag } from '../tag/tag'

export type CardCategoriasDashItem = {
  tagCategory: CategoryColor
  tagLabel: string
  itemsCount: number
  amount: number
}

type CardCategoriasDashProps = {
  items: readonly CardCategoriasDashItem[]
  className?: string
}

function formatItemsCount(value: number) {
  return `${value} ${value === 1 ? 'item' : 'itens'}`
}

export function CardCategoriasDash({
  items,
  className
}: CardCategoriasDashProps) {
  const resolvedClassName = ['surface card-categorias-dash', className]
    .filter(Boolean)
    .join(' ')

  return (
    <article className={resolvedClassName}>
      <header className="card-categorias-dash__header">
        <h3 className="card-categorias-dash__title">CATEGORIAS</h3>
        <UiLink
          to="/categories"
          iconRight={
            <Icon
              icone={UiIcon.ChevronRight}
              size={20}
              color={UiColor.BrandBase}
              aria-hidden="true"
            />
          }
        >
          Gerenciar
        </UiLink>
      </header>

      <div className="card-categorias-dash__body">
        {items.map(item => (
          <div
            key={`${item.tagCategory}-${item.tagLabel}`}
            className="card-categorias-dash__row"
          >
            <Tag category={item.tagCategory}>{item.tagLabel}</Tag>
            <span className="card-categorias-dash__count">
              {formatItemsCount(item.itemsCount)}
            </span>
            <strong className="card-categorias-dash__amount">
              {formatCurrency(item.amount)}
            </strong>
          </div>
        ))}
      </div>
    </article>
  )
}
