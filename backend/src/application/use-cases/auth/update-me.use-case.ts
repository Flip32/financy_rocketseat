import { z } from 'zod'

import type { UserRepository } from '../../../domain/contracts/repositories/user-repository.js'
import { AppError } from '../../../domain/errors/app-error.js'

import { assertAuthenticated } from '../shared/assert-authenticated.js'

const updateMeInputSchema = z.object({
  name: z.string().trim().min(2).max(80)
})

type UpdateMeInput = z.infer<typeof updateMeInputSchema>

export class UpdateMeUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string | null, input: UpdateMeInput) {
    const authenticatedUserId = assertAuthenticated(userId)
    const payload = updateMeInputSchema.parse(input)

    const updatedUser = await this.userRepository.update(authenticatedUserId, {
      name: payload.name
    })

    if (!updatedUser) {
      throw new AppError('NOT_FOUND', 'Usuário não encontrado')
    }

    return updatedUser
  }
}
