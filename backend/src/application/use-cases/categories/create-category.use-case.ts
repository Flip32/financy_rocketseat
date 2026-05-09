import { z } from 'zod'

import type { CategoryRepository } from '../../../domain/contracts/repositories/category-repository.js'

import { assertAuthenticated } from '../shared/assert-authenticated.js'
import { categoryIconPropsSchema } from './category-icon-props.js'

const inputSchema = z.object({
  name: z.string().trim().min(1).max(80),
  iconProps: categoryIconPropsSchema
})

type CreateCategoryInput = {
  name: string
  iconProps: {
    name: string
    color: string
  }
}

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(userId: string | null, input: CreateCategoryInput) {
    const authenticatedUserId = assertAuthenticated(userId)
    const payload = inputSchema.parse(input)

    return this.categoryRepository.create(authenticatedUserId, {
      name: payload.name,
      iconName: payload.iconProps.name,
      iconColor: payload.iconProps.color
    })
  }
}
