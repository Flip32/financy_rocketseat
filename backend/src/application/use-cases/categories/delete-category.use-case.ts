import type { CategoryRepository } from '../../../domain/contracts/repositories/category-repository.js'
import { AppError } from '../../../domain/errors/app-error.js'

import { assertAuthenticated } from '../shared/assert-authenticated.js'

export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(userId: string | null, categoryId: string) {
    const authenticatedUserId = assertAuthenticated(userId)

    const deleted = await this.categoryRepository.delete(
      categoryId,
      authenticatedUserId
    )

    if (!deleted) {
      throw new AppError('NOT_FOUND', 'Categoria não encontrada')
    }

    return true
  }
}
