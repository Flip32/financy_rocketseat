import type { Category } from '../../categories/types/category'

export type TransactionType = 'INCOME' | 'EXPENSE'

export type Transaction = {
  id: string
  title: string
  amount: number
  type: TransactionType
  occurredAt: string
  description: string | null
  category: Category
  createdAt: string
  updatedAt: string
}
