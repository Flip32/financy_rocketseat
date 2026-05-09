export type TransactionType = 'INCOME' | 'EXPENSE'

export type User = {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export type AuthUserRecord = User & {
  passwordHash: string
}

export type CategoryIconProps = {
  name: string
  color: string
}

export type Category = {
  id: string
  name: string
  iconProps: CategoryIconProps
  createdAt: string
  updatedAt: string
}

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
