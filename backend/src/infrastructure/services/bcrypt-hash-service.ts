import bcrypt from 'bcryptjs'

import type { HashService } from '../../domain/contracts/services/hash-service.js'

export class BcryptHashService implements HashService {
  async hash(value: string) {
    return bcrypt.hash(value, 10)
  }

  async compare(value: string, hash: string) {
    return bcrypt.compare(value, hash)
  }
}
