import type { ComponentProps } from 'react'

import { UiColor } from '../color-tokens'
import { UiIcon } from '../icon-tokens'
import { Icon } from '../icon/icon'
import { PaginationButton } from '../pagination-button/pagination-button'

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisiblePages?: number
  className?: string
  previousAriaLabel?: string
  nextAriaLabel?: string
}

type PaginationPageButtonType = ComponentProps<typeof PaginationButton>['type']

function clampPage(page: number, totalPages: number) {
  return Math.min(Math.max(page, 1), totalPages)
}

function resolveWindow(
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number
) {
  const safeMaxVisiblePages = Math.max(1, maxVisiblePages)

  if (totalPages <= safeMaxVisiblePages) {
    return {
      start: 1,
      end: totalPages
    }
  }

  const halfWindow = Math.floor(safeMaxVisiblePages / 2)

  let start = currentPage - halfWindow
  let end = start + safeMaxVisiblePages - 1

  if (start < 1) {
    start = 1
    end = safeMaxVisiblePages
  }

  if (end > totalPages) {
    end = totalPages
    start = end - safeMaxVisiblePages + 1
  }

  return { start, end }
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  className,
  previousAriaLabel = 'Página anterior',
  nextAriaLabel = 'Próxima página'
}: PaginationProps) {
  const safeTotalPages = Math.max(1, totalPages)
  const safeCurrentPage = clampPage(currentPage, safeTotalPages)
  const { start, end } = resolveWindow(
    safeCurrentPage,
    safeTotalPages,
    maxVisiblePages
  )

  const pages = Array.from(
    { length: end - start + 1 },
    (_, index) => start + index
  )

  const resolvedClassName = ['ui-pagination', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={resolvedClassName}>
      <PaginationButton
        type={safeCurrentPage === 1 ? 'Disabled' : 'Default'}
        onClick={() => onPageChange(safeCurrentPage - 1)}
        disabled={safeCurrentPage === 1}
        aria-label={previousAriaLabel}
      >
        <Icon
          icone={UiIcon.ChevronLeft}
          size={14}
          color={UiColor.Gray700}
          aria-hidden="true"
        />
      </PaginationButton>

      {pages.map(page => {
        const buttonType: PaginationPageButtonType =
          safeCurrentPage === page ? 'Active' : 'Default'

        return (
          <PaginationButton
            key={page}
            type={buttonType}
            onClick={() => onPageChange(page)}
            aria-label={`Ir para página ${page}`}
          >
            {page}
          </PaginationButton>
        )
      })}

      <PaginationButton
        type={safeCurrentPage === safeTotalPages ? 'Disabled' : 'Default'}
        onClick={() => onPageChange(safeCurrentPage + 1)}
        disabled={safeCurrentPage === safeTotalPages}
        aria-label={nextAriaLabel}
      >
        <Icon
          icone={UiIcon.ChevronRight}
          size={14}
          color={UiColor.Gray700}
          aria-hidden="true"
        />
      </PaginationButton>
    </div>
  )
}
