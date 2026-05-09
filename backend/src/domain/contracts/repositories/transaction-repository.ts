import type { Transaction, TransactionType } from '../../entities.js'

export type CreateTransactionData = {
  userId: string
  title: string
  amount: number
  type: TransactionType
  occurredAt: string
  description: string | null
  categoryId: string
}

export type UpdateTransactionData = {
  title?: string
  amount?: number
  type?: TransactionType
  occurredAt?: string
  description?: string | null
  categoryId?: string
}

export interface TransactionRepository {
  listByUserId(userId: string): Promise<Transaction[]>
  findByIdAndUserId(id: string, userId: string): Promise<Transaction | null>
  create(data: CreateTransactionData): Promise<Transaction>
  update(
    id: string,
    userId: string,
    data: UpdateTransactionData
  ): Promise<Transaction | null>
  delete(id: string, userId: string): Promise<boolean>
}
