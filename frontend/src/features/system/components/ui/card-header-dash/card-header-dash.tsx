import { formatCurrency } from '../../../../../lib/formatters'

import type { UiColorType } from '../color-tokens'
import type { UiIconType } from '../icon-tokens'
import { Icon } from '../icon/icon'

type CardHeaderDashProps = {
  iconName: UiIconType
  iconColor: UiColorType
  title: string
  value: number
}

export function CardHeaderDash({
  iconName,
  iconColor,
  title,
  value
}: CardHeaderDashProps) {
  return (
    <article className="surface card-header-dash">
      <div className="card-header-dash__head">
        <Icon icone={iconName} size={20} color={iconColor} aria-hidden="true" />
        <p className="card-header-dash__title">{title}</p>
      </div>

      <strong className="card-header-dash__value">
        {formatCurrency(value)}
      </strong>
    </article>
  )
}
