import type { UserRepository } from '../../../domain/contracts/repositories/user-repository.js'

import { assertAuthenticated } from '../shared/assert-authenticated.js'

export class GetMeUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string | null) {
    const authenticatedUserId = assertAuthenticated(userId)

    return this.userRepository.findById(authenticatedUserId)
  }
}
