import type { Express } from 'express'
import type { PrismaClient } from '@prisma/client'
import request from 'supertest'
import { beforeAll, beforeEach, afterAll, describe, expect, it } from 'vitest'

process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-secret'
process.env.DATABASE_URL = 'file:./test.db'
process.env.CORS_ORIGIN = 'http://localhost:5173'

type GraphQLResponse<T> = {
  data?: T
  errors?: Array<{ message: string; extensions?: { code?: string } }>
}

type SignUpData = {
  signUp: {
    token: string
    user: { id: string }
  }
}

type CreateCategoryData = {
  createCategory: {
    id: string
  }
}

type CreateTransactionData = {
  createTransaction: {
    id: string
  }
}

let app: Express
let prisma: PrismaClient

async function graphqlRequest<T>(
  query: string,
  variables: Record<string, unknown> = {},
  token?: string
) {
  const http = request(app).post('/graphql').send({ query, variables })

  if (token) {
    http.set('Authorization', `Bearer ${token}`)
  }

  return http
}

async function signUpUser(name: string, email: string) {
  const response = await graphqlRequest<SignUpData>(
    `mutation SignUp($input: SignUpInput!) {
      signUp(input: $input) {
        token
        user { id }
      }
    }`,
    {
      input: {
        name,
        email,
        password: 'password123'
      }
    }
  )

  expect(response.body.errors).toBeUndefined()
  return response.body.data?.signUp
}

async function createCategory(token: string) {
  const response = await graphqlRequest<CreateCategoryData>(
    `mutation CreateCategory($input: CreateCategoryInput!) {
      createCategory(input: $input) {
        id
      }
    }`,
    {
      input: {
        name: 'Moradia',
        iconProps: { name: 'house', color: 'blue' }
      }
    },
    token
  )

  expect(response.body.errors).toBeUndefined()
  return response.body.data?.createCategory
}

async function createTransaction(token: string, categoryId: string) {
  const response = await graphqlRequest<CreateTransactionData>(
    `mutation CreateTransaction($input: CreateTransactionInput!) {
      createTransaction(input: $input) {
        id
      }
    }`,
    {
      input: {
        title: 'Aluguel',
        amount: 1500,
        type: 'EXPENSE',
        occurredAt: new Date().toISOString(),
        description: 'Mensal',
        categoryId
      }
    },
    token
  )

  expect(response.body.errors).toBeUndefined()
  return response.body.data?.createTransaction
}

beforeAll(async () => {
  const appModule = await import('../../src/app.js')
  const prismaModule = await import('../../src/lib/prisma.js')

  app = await appModule.buildApp()
  prisma = prismaModule.prisma

  await prisma.$connect()
})

beforeEach(async () => {
  await prisma.transaction.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('User data isolation', () => {
  it('does not allow accessing other users data', async () => {
    const userA = await signUpUser('User A', 'usera@example.com')
    const userB = await signUpUser('User B', 'userb@example.com')

    expect(userA).toBeTruthy()
    expect(userB).toBeTruthy()

    const category = await createCategory(userA?.token ?? '')
    expect(category).toBeTruthy()

    const transaction = await createTransaction(
      userA?.token ?? '',
      category?.id ?? ''
    )
    expect(transaction).toBeTruthy()

    const categoriesResponse = await graphqlRequest<{ categories: unknown[] }>(
      `query Categories {
        categories { id }
      }`,
      {},
      userB?.token
    )

    expect(categoriesResponse.body.data?.categories ?? []).toHaveLength(0)

    const transactionsResponse = await graphqlRequest<{
      transactions: unknown[]
    }>(
      `query Transactions {
        transactions { id }
      }`,
      {},
      userB?.token
    )

    expect(transactionsResponse.body.data?.transactions ?? []).toHaveLength(0)

    const updateCategoryResponse = await graphqlRequest(
      `mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
        updateCategory(id: $id, input: $input) { id }
      }`,
      {
        id: category?.id,
        input: { name: 'Outro', iconProps: { name: 'house', color: 'blue' } }
      },
      userB?.token
    )

    expect(updateCategoryResponse.body.errors?.[0]?.extensions?.code).toBe(
      'NOT_FOUND'
    )

    const deleteCategoryResponse = await graphqlRequest(
      `mutation DeleteCategory($id: ID!) {
        deleteCategory(id: $id)
      }`,
      { id: category?.id },
      userB?.token
    )

    expect(deleteCategoryResponse.body.errors?.[0]?.extensions?.code).toBe(
      'NOT_FOUND'
    )

    const updateTransactionResponse = await graphqlRequest(
      `mutation UpdateTransaction($id: ID!, $input: UpdateTransactionInput!) {
        updateTransaction(id: $id, input: $input) { id }
      }`,
      {
        id: transaction?.id,
        input: { title: 'Outro' }
      },
      userB?.token
    )

    expect(updateTransactionResponse.body.errors?.[0]?.extensions?.code).toBe(
      'NOT_FOUND'
    )

    const deleteTransactionResponse = await graphqlRequest(
      `mutation DeleteTransaction($id: ID!) {
        deleteTransaction(id: $id)
      }`,
      { id: transaction?.id },
      userB?.token
    )

    expect(deleteTransactionResponse.body.errors?.[0]?.extensions?.code).toBe(
      'NOT_FOUND'
    )
  })
})
