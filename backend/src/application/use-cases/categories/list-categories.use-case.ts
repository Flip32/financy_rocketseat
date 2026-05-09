import type { CategoryRepository } from '../../../domain/contracts/repositories/category-repository.js'

import { assertAuthenticated } from '../shared/assert-authenticated.js'

export class ListCategoriesUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(userId: string | null) {
    const authenticatedUserId = assertAuthenticated(userId)

    return this.categoryRepository.listByUserId(authenticatedUserId)
  }
}
