import { z } from 'zod'

import type { CategoryRepository } from '../../../domain/contracts/repositories/category-repository.js'
import type {
  TransactionRepository,
  UpdateTransactionData
} from '../../../domain/contracts/repositories/transaction-repository.js'
import { AppError } from '../../../domain/errors/app-error.js'

import { assertAuthenticated } from '../shared/assert-authenticated.js'

const inputSchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    amount: z.number().positive().optional(),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    occurredAt: z
      .string()
      .refine(value => !Number.isNaN(Date.parse(value)), {
        message: 'Data inválida'
      })
      .optional(),
    description: z.string().trim().max(500).optional().nullable(),
    categoryId: z.string().min(1).optional()
  })
  .refine(input => Object.keys(input).length > 0, {
    message: 'Informe ao menos um campo para atualização'
  })

type UpdateTransactionInput = z.infer<typeof inputSchema>

export class UpdateTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async execute(
    userId: string | null,
    transactionId: string,
    input: UpdateTransactionInput
  ) {
    const authenticatedUserId = assertAuthenticated(userId)
    const payload = inputSchema.parse(input)

    const data: UpdateTransactionData = {
      title: payload.title,
      amount: payload.amount,
      type: payload.type,
      occurredAt: payload.occurredAt,
      description: payload.description
    }

    if (payload.categoryId) {
      const category = await this.categoryRepository.findByIdAndUserId(
        payload.categoryId,
        authenticatedUserId
      )

      if (!category) {
        throw new AppError(
          'BAD_USER_INPUT',
          'Categoria inválida para este usuário'
        )
      }

      data.categoryId = category.id
    }

    const updatedTransaction = await this.transactionRepository.update(
      transactionId,
      authenticatedUserId,
      data
    )

    if (!updatedTransaction) {
      throw new AppError('NOT_FOUND', 'Transação não encontrada')
    }

    return updatedTransaction
  }
}
