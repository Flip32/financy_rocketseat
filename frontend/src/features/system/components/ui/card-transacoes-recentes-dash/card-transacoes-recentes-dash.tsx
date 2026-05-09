import type { CategoryColor } from '../../../../../lib/category-color'

import { formatCurrency } from '../../../../../lib/formatters'

import { CardCategoriaIcon } from '../card-catergoria-icon/card-catergoria-icon'
import { UiColor } from '../color-tokens'
import { UiIcon, type UiIconType } from '../icon-tokens'
import { Icon } from '../icon/icon'
import { UiLink } from '../link/link'
import { Tag } from '../tag/tag'

export type CardTransacoesRecentesDashItem = {
  id: string
  iconName: UiIconType
  iconColor: CategoryColor
  title: string
  subtitle: string
  tagLabel: string
  tagCategory: CategoryColor
  amount: number
}

type CardTransacoesRecentesDashProps = {
  items: readonly CardTransacoesRecentesDashItem[]
  viewAllTo?: string
  footerTo?: string
  footerLabel?: string
  className?: string
}

function formatSignedAmount(value: number) {
  const signal = value >= 0 ? '+' : '-'
  return `${signal} ${formatCurrency(Math.abs(value))}`
}

export function CardTransacoesRecentesDash({
  items,
  viewAllTo = '/transactions',
  footerTo = '/transactions',
  footerLabel = 'Nova transação',
  className
}: CardTransacoesRecentesDashProps) {
  const resolvedClassName = ['surface card-transacoes-recentes-dash', className]
    .filter(Boolean)
    .join(' ')

  return (
    <article className={resolvedClassName}>
      <header className="card-transacoes-recentes-dash__header">
        <h3 className="card-transacoes-recentes-dash__title">
          TRANSAÇÕES RECENTES
        </h3>
        <UiLink
          to={viewAllTo}
          iconRight={
            <Icon
              icone={UiIcon.ChevronRight}
              size={20}
              color={UiColor.BrandBase}
              aria-hidden="true"
            />
          }
        >
          Ver todas
        </UiLink>
      </header>

      <div className="card-transacoes-recentes-dash__body">
        {items.map(item => {
          const isPositive = item.amount >= 0
          const amountIcon = isPositive
            ? UiIcon.CircleArrowUp
            : UiIcon.CircleArrowDown
          const amountIconColor = isPositive
            ? UiColor.BrandBase
            : UiColor.RedBase

          return (
            <div key={item.id} className="card-transacoes-recentes-dash__row">
              <div className="card-transacoes-recentes-dash__main">
                <CardCategoriaIcon
                  color={item.iconColor}
                  iconName={item.iconName}
                />
                <div className="card-transacoes-recentes-dash__main-copy">
                  <p className="card-transacoes-recentes-dash__main-title">
                    {item.title}
                  </p>
                  <p className="card-transacoes-recentes-dash__main-subtitle">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <div className="card-transacoes-recentes-dash__tag">
                <Tag category={item.tagCategory}>{item.tagLabel}</Tag>
              </div>

              <div className="card-transacoes-recentes-dash__value">
                <strong className="card-transacoes-recentes-dash__value-text">
                  {formatSignedAmount(item.amount)}
                </strong>
                <Icon
                  icone={amountIcon}
                  size={16}
                  color={amountIconColor}
                  aria-hidden="true"
                />
              </div>
            </div>
          )
        })}
      </div>

      <footer className="card-transacoes-recentes-dash__footer">
        <UiLink
          to={footerTo}
          iconLeft={
            <Icon
              icone={UiIcon.Plus}
              size={20}
              color={UiColor.BrandBase}
              aria-hidden="true"
            />
          }
        >
          {footerLabel}
        </UiLink>
      </footer>
    </article>
  )
}
