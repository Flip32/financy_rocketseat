import type { TransactionRepository } from '../../../domain/contracts/repositories/transaction-repository.js'
import { AppError } from '../../../domain/errors/app-error.js'

import { assertAuthenticated } from '../shared/assert-authenticated.js'

export class DeleteTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(userId: string | null, transactionId: string) {
    const authenticatedUserId = assertAuthenticated(userId)

    const deleted = await this.transactionRepository.delete(
      transactionId,
      authenticatedUserId
    )

    if (!deleted) {
      throw new AppError('NOT_FOUND', 'Transação não encontrada')
    }

    return true
  }
}
