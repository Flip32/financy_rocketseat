export interface TokenService {
  sign(userId: string): string
  verify(token: string): { sub: string } | null
}
