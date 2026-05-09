import type {
  CreateTransactionData,
  TransactionRepository,
  UpdateTransactionData
} from '../../../domain/contracts/repositories/transaction-repository.js'
import { prisma } from '../../../lib/prisma.js'

import { mapTransaction } from './mappers.js'

export class PrismaTransactionRepository implements TransactionRepository {
  async listByUserId(userId: string) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: [{ occurredAt: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        title: true,
        amount: true,
        type: true,
        occurredAt: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            iconName: true,
            iconColor: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    })

    return transactions.map(mapTransaction)
  }

  async findByIdAndUserId(id: string, userId: string) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId
      },
      select: {
        id: true,
        title: true,
        amount: true,
        type: true,
        occurredAt: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            iconName: true,
            iconColor: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    })

    if (!transaction) {
      return null
    }

    return mapTransaction(transaction)
  }

  async create(data: CreateTransactionData) {
    const transaction = await prisma.transaction.create({
      data: {
        userId: data.userId,
        title: data.title,
        amount: data.amount,
        type: data.type,
        occurredAt: new Date(data.occurredAt),
        description: data.description,
        categoryId: data.categoryId
      },
      select: {
        id: true,
        title: true,
        amount: true,
        type: true,
        occurredAt: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            iconName: true,
            iconColor: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    })

    return mapTransaction(transaction)
  }

  async update(id: string, userId: string, data: UpdateTransactionData) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId
      },
      select: { id: true }
    })

    if (!transaction) {
      return null
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        title: data.title,
        amount: data.amount,
        type: data.type,
        occurredAt: data.occurredAt ? new Date(data.occurredAt) : undefined,
        description: data.description,
        categoryId: data.categoryId
      },
      select: {
        id: true,
        title: true,
        amount: true,
        type: true,
        occurredAt: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            iconName: true,
            iconColor: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    })

    return mapTransaction(updatedTransaction)
  }

  async delete(id: string, userId: string) {
    const deleted = await prisma.transaction.deleteMany({
      where: {
        id,
        userId
      }
    })

    return deleted.count > 0
  }
}
