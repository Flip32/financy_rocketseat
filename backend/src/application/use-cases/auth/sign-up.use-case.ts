import { z } from 'zod'

import type { UserRepository } from '../../../domain/contracts/repositories/user-repository.js'
import type { HashService } from '../../../domain/contracts/services/hash-service.js'
import type { TokenService } from '../../../domain/contracts/services/token-service.js'
import { AppError } from '../../../domain/errors/app-error.js'

const signUpInputSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  password: z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres.')
    .max(100)
})

type SignUpInput = z.infer<typeof signUpInputSchema>

export type SignUpOutput = {
  token: string
  user: {
    id: string
    name: string
    email: string
    createdAt: string
    updatedAt: string
  }
}

export class SignUpUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService
  ) {}

  async execute(input: SignUpInput): Promise<SignUpOutput> {
    const payload = signUpInputSchema.parse(input)
    const email = payload.email.toLowerCase()

    const existingUser = await this.userRepository.findAuthByEmail(email)

    if (existingUser) {
      throw new AppError(
        'BAD_USER_INPUT',
        'Já existe uma conta com este e-mail'
      )
    }

    const passwordHash = await this.hashService.hash(payload.password)

    const user = await this.userRepository.create({
      name: payload.name,
      email,
      passwordHash
    })

    const token = this.tokenService.sign(user.id)

    return {
      token,
      user
    }
  }
}
