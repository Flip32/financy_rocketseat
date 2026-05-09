import { z } from 'zod'

import type { CategoryRepository } from '../../../domain/contracts/repositories/category-repository.js'
import { AppError } from '../../../domain/errors/app-error.js'

import { assertAuthenticated } from '../shared/assert-authenticated.js'
import { categoryIconPropsSchema } from './category-icon-props.js'

const inputSchema = z.object({
  name: z.string().trim().min(1).max(80),
  iconProps: categoryIconPropsSchema
})

type UpdateCategoryInput = {
  name: string
  iconProps: {
    name: string
    color: string
  }
}

export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(
    userId: string | null,
    categoryId: string,
    input: UpdateCategoryInput
  ) {
    const authenticatedUserId = assertAuthenticated(userId)
    const payload = inputSchema.parse(input)

    const updatedCategory = await this.categoryRepository.update(
      categoryId,
      authenticatedUserId,
      {
        name: payload.name,
        iconName: payload.iconProps.name,
        iconColor: payload.iconProps.color
      }
    )

    if (!updatedCategory) {
      throw new AppError('NOT_FOUND', 'Categoria não encontrada')
    }

    return updatedCategory
  }
}
