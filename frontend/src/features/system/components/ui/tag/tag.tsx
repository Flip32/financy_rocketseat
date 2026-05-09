import type { ReactNode } from 'react'
import type { CategoryColor } from '../../../../../lib/category-color'

type TagProps = {
  category?: CategoryColor
  children: ReactNode
}

export function Tag({ category = 'gray', children }: TagProps) {
  return (
    <span className={`category-badge category-badge--${category}`}>
      {children}
    </span>
  )
}
