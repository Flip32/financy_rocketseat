import type {
  Category,
  Transaction,
  TransactionType,
  User
} from '../../../domain/entities.js'

type UserDatabaseRecord = {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

type CategoryDatabaseRecord = {
  id: string
  name: string
  iconName: string
  iconColor: string
  createdAt: Date
  updatedAt: Date
}

type TransactionDatabaseRecord = {
  id: string
  title: string
  amount: number
  type: string
  occurredAt: Date
  description: string | null
  createdAt: Date
  updatedAt: Date
  category: CategoryDatabaseRecord
}

function mapDate(date: Date) {
  return date.toISOString()
}

function mapTransactionType(type: string): TransactionType {
  if (type === 'INCOME' || type === 'EXPENSE') {
    return type
  }

  return 'EXPENSE'
}

export function mapUser(record: UserDatabaseRecord): User {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    createdAt: mapDate(record.createdAt),
    updatedAt: mapDate(record.updatedAt)
  }
}

export function mapCategory(record: CategoryDatabaseRecord): Category {
  return {
    id: record.id,
    name: record.name,
    iconProps: {
      name: record.iconName,
      color: record.iconColor
    },
    createdAt: mapDate(record.createdAt),
    updatedAt: mapDate(record.updatedAt)
  }
}

export function mapTransaction(record: TransactionDatabaseRecord): Transaction {
  return {
    id: record.id,
    title: record.title,
    amount: record.amount,
    type: mapTransactionType(record.type),
    occurredAt: mapDate(record.occurredAt),
    description: record.description,
    category: mapCategory(record.category),
    createdAt: mapDate(record.createdAt),
    updatedAt: mapDate(record.updatedAt)
  }
}
