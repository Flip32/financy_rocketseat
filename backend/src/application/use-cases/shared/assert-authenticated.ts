import { AppError } from '../../../domain/errors/app-error.js'

export function assertAuthenticated(userId: string | null): string {
  if (!userId) {
    throw new AppError('UNAUTHENTICATED', 'Não autenticado')
  }

  return userId
}
