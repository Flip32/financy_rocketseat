import { Prisma } from '@prisma/client'

import type { CategoryRepository } from '../../../domain/contracts/repositories/category-repository.js'
import { AppError } from '../../../domain/errors/app-error.js'
import { prisma } from '../../../lib/prisma.js'

import { mapCategory } from './mappers.js'

export class PrismaCategoryRepository implements CategoryRepository {
  async listByUserId(userId: string) {
    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        iconName: true,
        iconColor: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return categories.map(mapCategory)
  }

  async findByIdAndUserId(id: string, userId: string) {
    const category = await prisma.category.findFirst({
      where: {
        id,
        userId
      },
      select: {
        id: true,
        name: true,
        iconName: true,
        iconColor: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!category) {
      return null
    }

    return mapCategory(category)
  }

  async create(
    userId: string,
    data: {
      name: string
      iconName: string
      iconColor: string
    }
  ) {
    try {
      const category = await prisma.category.create({
        data: {
          userId,
          name: data.name,
          iconName: data.iconName,
          iconColor: data.iconColor
        },
        select: {
          id: true,
          name: true,
          iconName: true,
          iconColor: true,
          createdAt: true,
          updatedAt: true
        }
      })

      return mapCategory(category)
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new AppError(
          'CONFLICT',
          'Você já possui uma categoria com este nome'
        )
      }

      throw error
    }
  }

  async update(
    id: string,
    userId: string,
    data: {
      name: string
      iconName: string
      iconColor: string
    }
  ) {
    const category = await prisma.category.findFirst({
      where: {
        id,
        userId
      },
      select: { id: true }
    })

    if (!category) {
      return null
    }

    try {
      const updatedCategory = await prisma.category.update({
        where: { id: category.id },
        data: {
          name: data.name,
          iconName: data.iconName,
          iconColor: data.iconColor
        },
        select: {
          id: true,
          name: true,
          iconName: true,
          iconColor: true,
          createdAt: true,
          updatedAt: true
        }
      })

      return mapCategory(updatedCategory)
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new AppError(
          'CONFLICT',
          'Você já possui uma categoria com este nome'
        )
      }

      throw error
    }
  }

  async delete(id: string, userId: string) {
    const category = await prisma.category.findFirst({
      where: {
        id,
        userId
      },
      select: { id: true }
    })

    if (!category) {
      return false
    }

    try {
      await prisma.category.delete({
        where: { id: category.id }
      })

      return true
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new AppError(
          'BAD_USER_INPUT',
          'Não é possível excluir categoria com transações vinculadas'
        )
      }

      throw error
    }
  }
}
