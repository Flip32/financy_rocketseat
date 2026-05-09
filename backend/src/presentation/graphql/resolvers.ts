import type { makeUseCases } from '../../main/factories/make-use-cases.js'

import type { GraphQLContext } from './context.js'
import { toGraphQLError } from './error-mapper.js'

type UseCases = ReturnType<typeof makeUseCases>

type SignUpArgs = {
  input: {
    name: string
    email: string
    password: string
  }
}

type SignInArgs = {
  input: {
    email: string
    password: string
  }
}

type UpdateMeArgs = {
  input: {
    name: string
  }
}

type UpdateCategoryArgs = {
  id: string
  input: {
    name: string
    iconProps: {
      name: string
      color: string
    }
  }
}

type DeleteCategoryArgs = {
  id: string
}

type CreateCategoryArgs = {
  input: {
    name: string
    iconProps: {
      name: string
      color: string
    }
  }
}

type CreateTransactionArgs = {
  input: {
    title: string
    amount: number
    type: 'INCOME' | 'EXPENSE'
    occurredAt: string
    description?: string | null
    categoryId: string
  }
}

type UpdateTransactionArgs = {
  id: string
  input: {
    title?: string
    amount?: number
    type?: 'INCOME' | 'EXPENSE'
    occurredAt?: string
    description?: string | null
    categoryId?: string
  }
}

type DeleteTransactionArgs = {
  id: string
}

export function makeResolvers(useCases: UseCases) {
  return {
    Query: {
      health: () => 'ok',
      me: async (_: unknown, __: unknown, context: GraphQLContext) => {
        try {
          return await useCases.auth.getMe.execute(context.userId)
        } catch (error) {
          toGraphQLError(error)
        }
      },
      categories: async (_: unknown, __: unknown, context: GraphQLContext) => {
        try {
          return await useCases.categories.list.execute(context.userId)
        } catch (error) {
          toGraphQLError(error)
        }
      },
      transactions: async (
        _: unknown,
        __: unknown,
        context: GraphQLContext
      ) => {
        try {
          return await useCases.transactions.list.execute(context.userId)
        } catch (error) {
          toGraphQLError(error)
        }
      }
    },
    Mutation: {
      signUp: async (_: unknown, args: SignUpArgs) => {
        try {
          return await useCases.auth.signUp.execute(args.input)
        } catch (error) {
          toGraphQLError(error)
        }
      },
      signIn: async (_: unknown, args: SignInArgs) => {
        try {
          return await useCases.auth.signIn.execute(args.input)
        } catch (error) {
          toGraphQLError(error)
        }
      },
      updateMe: async (
        _: unknown,
        args: UpdateMeArgs,
        context: GraphQLContext
      ) => {
        try {
          return await useCases.auth.updateMe.execute(
            context.userId,
            args.input
          )
        } catch (error) {
          toGraphQLError(error)
        }
      },
      createCategory: async (
        _: unknown,
        args: CreateCategoryArgs,
        context: GraphQLContext
      ) => {
        try {
          return await useCases.categories.create.execute(
            context.userId,
            args.input
          )
        } catch (error) {
          toGraphQLError(error)
        }
      },
      updateCategory: async (
        _: unknown,
        args: UpdateCategoryArgs,
        context: GraphQLContext
      ) => {
        try {
          return await useCases.categories.update.execute(
            context.userId,
            args.id,
            args.input
          )
        } catch (error) {
          toGraphQLError(error)
        }
      },
      deleteCategory: async (
        _: unknown,
        args: DeleteCategoryArgs,
        context: GraphQLContext
      ) => {
        try {
          return await useCases.categories.delete.execute(
            context.userId,
            args.id
          )
        } catch (error) {
          toGraphQLError(error)
        }
      },
      createTransaction: async (
        _: unknown,
        args: CreateTransactionArgs,
        context: GraphQLContext
      ) => {
        try {
          return await useCases.transactions.create.execute(
            context.userId,
            args.input
          )
        } catch (error) {
          toGraphQLError(error)
        }
      },
      updateTransaction: async (
        _: unknown,
        args: UpdateTransactionArgs,
        context: GraphQLContext
      ) => {
        try {
          return await useCases.transactions.update.execute(
            context.userId,
            args.id,
            args.input
          )
        } catch (error) {
          toGraphQLError(error)
        }
      },
      deleteTransaction: async (
        _: unknown,
        args: DeleteTransactionArgs,
        context: GraphQLContext
      ) => {
        try {
          return await useCases.transactions.delete.execute(
            context.userId,
            args.id
          )
        } catch (error) {
          toGraphQLError(error)
        }
      }
    }
  }
}
