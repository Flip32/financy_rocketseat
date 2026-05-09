import type { AuthUserRecord, User } from '../../entities.js'

export type CreateUserData = {
  name: string
  email: string
  passwordHash: string
}

export type UpdateUserData = {
  name: string
}

export interface UserRepository {
  findById(id: string): Promise<User | null>
  findAuthByEmail(email: string): Promise<AuthUserRecord | null>
  create(data: CreateUserData): Promise<User>
  update(id: string, data: UpdateUserData): Promise<User | null>
}
