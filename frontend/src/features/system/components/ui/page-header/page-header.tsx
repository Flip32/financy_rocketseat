import { UiIcon } from '../icon-tokens'
import { LabelButton } from '../label-button/label-button'

type PageHeaderProps = {
  title: string
  description: string
  label: string
  onActionClick: () => void
  actionDisabled?: boolean
  className?: string
}

export function PageHeader({
  title,
  description,
  label,
  onActionClick,
  actionDisabled = false,
  className
}: PageHeaderProps) {
  const resolvedClassName = ['page-header', className].filter(Boolean).join(' ')

  return (
    <header className={resolvedClassName}>
      <div className="page-header__content">
        <h1 className="page-header__title">{title}</h1>
        <p className="page-header__description">{description}</p>
      </div>

      <LabelButton
        icone={UiIcon.Plus}
        onClick={onActionClick}
        disabled={actionDisabled}
        size={'Sm'}
      >
        {label}
      </LabelButton>
    </header>
  )
}
