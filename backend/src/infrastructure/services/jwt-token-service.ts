import jwt from 'jsonwebtoken'

import { env } from '../../config/env.js'
import type { TokenService } from '../../domain/contracts/services/token-service.js'

type DecodedToken = {
  sub: string
}

export class JwtTokenService implements TokenService {
  sign(userId: string) {
    return jwt.sign({}, env.JWT_SECRET, {
      subject: userId,
      expiresIn: '7d'
    })
  }

  verify(token: string): DecodedToken | null {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET)

      if (!decoded || typeof decoded !== 'object') {
        return null
      }

      if (!decoded.sub || typeof decoded.sub !== 'string') {
        return null
      }

      return { sub: decoded.sub }
    } catch {
      return null
    }
  }
}
