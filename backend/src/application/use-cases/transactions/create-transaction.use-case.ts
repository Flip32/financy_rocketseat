import { z } from 'zod'

import type { CategoryRepository } from '../../../domain/contracts/repositories/category-repository.js'
import type { TransactionRepository } from '../../../domain/contracts/repositories/transaction-repository.js'
import { AppError } from '../../../domain/errors/app-error.js'

import { assertAuthenticated } from '../shared/assert-authenticated.js'

const inputSchema = z.object({
  title: z.string().trim().min(1).max(120),
  amount: z.number().positive(),
  type: z.enum(['INCOME', 'EXPENSE']),
  occurredAt: z.string().refine(value => !Number.isNaN(Date.parse(value)), {
    message: 'Data inválida'
  }),
  description: z.string().trim().max(500).optional().nullable(),
  categoryId: z.string().min(1)
})

type CreateTransactionInput = z.infer<typeof inputSchema>

export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async execute(userId: string | null, input: CreateTransactionInput) {
    const authenticatedUserId = assertAuthenticated(userId)
    const payload = inputSchema.parse(input)

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

    return this.transactionRepository.create({
      userId: authenticatedUserId,
      title: payload.title,
      amount: payload.amount,
      type: payload.type,
      occurredAt: payload.occurredAt,
      description: payload.description ?? null,
      categoryId: category.id
    })
  }
}
