import {
  CATEGORY_COLOR_VALUES,
  type CategoryColor
} from '../../../lib/category-color'
import type { Category } from '../types/category'

export type { CategoryColor } from '../../../lib/category-color'

export type CategoryIcon =
  | 'briefcase-business'
  | 'car-front'
  | 'heart-pulse'
  | 'piggy-bank'
  | 'shopping-cart'
  | 'ticket'
  | 'tool-case'
  | 'gift'
  | 'utensils'
  | 'paw-print'
  | 'house'
  | 'dumbbell'
  | 'book-open'
  | 'baggage-claim'
  | 'mailbox'
  | 'receipt-text'

export type CategoryVisual = {
  description: string
  color: CategoryColor
  icon: CategoryIcon
}

const CATEGORY_ICON_VALUES: CategoryIcon[] = [
  'briefcase-business',
  'car-front',
  'heart-pulse',
  'piggy-bank',
  'shopping-cart',
  'ticket',
  'tool-case',
  'gift',
  'utensils',
  'paw-print',
  'house',
  'dumbbell',
  'book-open',
  'baggage-claim',
  'mailbox',
  'receipt-text'
]

export const CATEGORY_COLOR_OPTIONS: Array<{
  key: Exclude<CategoryColor, 'gray'>
  label: string
}> = [
  { key: 'green', label: 'Verde' },
  { key: 'blue', label: 'Azul' },
  { key: 'purple', label: 'Roxo' },
  { key: 'pink', label: 'Rosa' },
  { key: 'red', label: 'Vermelho' },
  { key: 'orange', label: 'Laranja' },
  { key: 'yellow', label: 'Amarelo' }
]

export const CATEGORY_ICON_OPTIONS: Array<{
  key: CategoryIcon
  label: string
}> = [
  { key: 'briefcase-business', label: 'Trabalho' },
  { key: 'car-front', label: 'Transporte' },
  { key: 'heart-pulse', label: 'Saúde' },
  { key: 'piggy-bank', label: 'Investimento' },
  { key: 'shopping-cart', label: 'Mercado' },
  { key: 'ticket', label: 'Entretenimento' },
  { key: 'tool-case', label: 'Ferramentas' },
  { key: 'utensils', label: 'Alimentação' },
  { key: 'paw-print', label: 'Pets' },
  { key: 'house', label: 'Casa' },
  { key: 'gift', label: 'Presente' },
  { key: 'baggage-claim', label: 'Utilidades' },
  { key: 'dumbbell', label: 'Fitness' },
  { key: 'book-open', label: 'Estudos' },
  { key: 'mailbox', label: 'Correio' },
  { key: 'receipt-text', label: 'Recibos' }
]

export function normalizeCategoryColor(
  value: string | undefined
): CategoryColor {
  if (!value) {
    return 'gray'
  }

  if (CATEGORY_COLOR_VALUES.includes(value as CategoryColor)) {
    return value as CategoryColor
  }

  return 'gray'
}

export function normalizeCategoryIcon(value: string | undefined): CategoryIcon {
  if (!value) {
    return 'paw-print'
  }

  if (CATEGORY_ICON_VALUES.includes(value as CategoryIcon)) {
    return value as CategoryIcon
  }

  return 'paw-print'
}

export function resolveCategoryVisual(
  category: Category,
  storedDescription: string | undefined
): CategoryVisual {
  return {
    description: storedDescription?.trim() || 'Categoria personalizada',
    color: normalizeCategoryColor(category.iconProps?.color),
    icon: normalizeCategoryIcon(category.iconProps?.name)
  }
}

export function getCategoryInitials(name: string) {
  const parts = name
    .split(' ')
    .map(part => part.trim())
    .filter(Boolean)

  if (parts.length === 0) {
    return 'CT'
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

export function getCategoryToneClass(color: CategoryColor) {
  return `category-tone category-tone--${color}`
}
