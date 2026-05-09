import type { TokenService } from '../../domain/contracts/services/token-service.js'

export type GraphQLContext = {
  userId: string | null
}

export function buildGraphQLContext(
  authorizationHeader: string | undefined,
  tokenService: TokenService
): GraphQLContext {
  if (!authorizationHeader) {
    return { userId: null }
  }

  const [scheme, token] = authorizationHeader.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return { userId: null }
  }

  const payload = tokenService.verify(token)

  return {
    userId: payload?.sub ?? null
  }
}
