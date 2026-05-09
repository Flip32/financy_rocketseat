import { z } from 'zod'

import type { UserRepository } from '../../../domain/contracts/repositories/user-repository.js'
import type { HashService } from '../../../domain/contracts/services/hash-service.js'
import type { TokenService } from '../../../domain/contracts/services/token-service.js'
import { AppError } from '../../../domain/errors/app-error.js'

const signInInputSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres.')
})

type SignInInput = z.infer<typeof signInInputSchema>

export type SignInOutput = {
  token: string
  user: {
    id: string
    name: string
    email: string
    createdAt: string
    updatedAt: string
  }
}

export class SignInUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService
  ) {}

  async execute(input: SignInInput): Promise<SignInOutput> {
    const payload = signInInputSchema.parse(input)
    const email = payload.email.toLowerCase()

    const user = await this.userRepository.findAuthByEmail(email)

    if (!user) {
      throw new AppError('UNAUTHENTICATED', 'E-mail ou senha inválidos')
    }

    const passwordMatches = await this.hashService.compare(
      payload.password,
      user.passwordHash
    )

    if (!passwordMatches) {
      throw new AppError('UNAUTHENTICATED', 'E-mail ou senha inválidos')
    }

    const token = this.tokenService.sign(user.id)

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  }
}
