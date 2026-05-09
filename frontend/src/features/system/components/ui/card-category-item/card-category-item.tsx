import type { CategoryColor } from '../../../../../lib/category-color'
import { CardCategoriaIcon } from '../card-catergoria-icon/card-catergoria-icon'
import { IconButton } from '../icon-button/icon-button'
import { UiIcon, type UiIconType } from '../icon-tokens'
import { Tag } from '../tag/tag'

export type CardCategoryItemProps = {
  iconName: UiIconType
  iconColor: CategoryColor
  title: string
  description: string
  tagLabel: string
  tagCategory: CategoryColor
  itemsCount: number
  className?: string
  showActions?: boolean
  onEditClick?: () => void
  onDeleteClick?: () => void
}

export function CardCategoryItem({
  iconName,
  iconColor,
  title,
  description,
  tagLabel,
  tagCategory,
  itemsCount,
  className,
  showActions = true,
  onEditClick,
  onDeleteClick
}: CardCategoryItemProps) {
  const resolvedClassName = ['surface card-category-item', className]
    .filter(Boolean)
    .join(' ')

  return (
    <article className={resolvedClassName}>
      <header className="card-category-item__header">
        <CardCategoriaIcon color={iconColor} iconName={iconName} />

        {showActions ? (
          <div className="card-category-item__actions">
            <IconButton
              variant="Danger"
              icone={UiIcon.Trash}
              onClick={onDeleteClick}
              aria-label={`Excluir categoria ${title}`}
            />
            <IconButton
              icone={UiIcon.SquarePen}
              onClick={onEditClick}
              aria-label={`Editar categoria ${title}`}
            />
          </div>
        ) : null}
      </header>

      <div className="card-category-item__content">
        <h3 className="card-category-item__title">{title}</h3>
        <p className="card-category-item__description">{description}</p>
      </div>

      <footer className="card-category-item__footer">
        <Tag category={tagCategory}>{tagLabel}</Tag>
        <span className="card-category-item__count">{itemsCount} itens</span>
      </footer>
    </article>
  )
}
