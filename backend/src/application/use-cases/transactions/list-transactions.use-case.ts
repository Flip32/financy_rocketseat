import type { TransactionRepository } from '../../../domain/contracts/repositories/transaction-repository.js'

import { assertAuthenticated } from '../shared/assert-authenticated.js'

export class ListTransactionsUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(userId: string | null) {
    const authenticatedUserId = assertAuthenticated(userId)

    return this.transactionRepository.listByUserId(authenticatedUserId)
  }
}
