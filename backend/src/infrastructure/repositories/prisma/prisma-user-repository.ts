import type {
  CreateUserData,
  UpdateUserData,
  UserRepository
} from '../../../domain/contracts/repositories/user-repository.js'
import type { AuthUserRecord } from '../../../domain/entities.js'
import { prisma } from '../../../lib/prisma.js'

import { mapUser } from './mappers.js'

export class PrismaUserRepository implements UserRepository {
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return null
    }

    return mapUser(user)
  }

  async findAuthByEmail(email: string): Promise<AuthUserRecord | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return null
    }

    return {
      ...mapUser(user),
      passwordHash: user.passwordHash
    }
  }

  async create(data: CreateUserData) {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return mapUser(user)
  }

  async update(id: string, data: UpdateUserData) {
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true }
    })

    if (!existingUser) {
      return null
    }

    const user = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name: data.name
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return mapUser(user)
  }
}
