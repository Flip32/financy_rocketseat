import { GraphQLError } from 'graphql'
import { ZodError } from 'zod'

import { AppError } from '../../domain/errors/app-error.js'

export function toGraphQLError(error: unknown): never {
  if (error instanceof GraphQLError) {
    throw error
  }

  if (error instanceof AppError) {
    throw new GraphQLError(error.message, {
      extensions: { code: error.code }
    })
  }

  if (error instanceof ZodError) {
    const issue = error.issues[0]
    const message = issue?.message ?? 'Dados inválidos'

    throw new GraphQLError(message, {
      extensions: { code: 'BAD_USER_INPUT' }
    })
  }

  throw error
}
