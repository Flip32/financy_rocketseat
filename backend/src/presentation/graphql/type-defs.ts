export const typeDefs = `#graphql
  enum TransactionType {
    INCOME
    EXPENSE
  }

  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type Category {
    id: ID!
    name: String!
    iconProps: IconProps!
    createdAt: String!
    updatedAt: String!
  }

  type IconProps {
    name: String!
    color: String!
  }

  type Transaction {
    id: ID!
    title: String!
    amount: Float!
    type: TransactionType!
    occurredAt: String!
    description: String
    category: Category!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input SignUpInput {
    name: String!
    email: String!
    password: String!
  }

  input SignInInput {
    email: String!
    password: String!
  }

  input UpdateMeInput {
    name: String!
  }

  input CreateCategoryInput {
    name: String!
    iconProps: IconPropsInput!
  }

  input UpdateCategoryInput {
    name: String!
    iconProps: IconPropsInput!
  }

  input IconPropsInput {
    name: String!
    color: String!
  }

  input CreateTransactionInput {
    title: String!
    amount: Float!
    type: TransactionType!
    occurredAt: String!
    description: String
    categoryId: ID!
  }

  input UpdateTransactionInput {
    title: String
    amount: Float
    type: TransactionType
    occurredAt: String
    description: String
    categoryId: ID
  }

  type Query {
    health: String!
    me: User
    categories: [Category!]!
    transactions: [Transaction!]!
  }

  type Mutation {
    signUp(input: SignUpInput!): AuthPayload!
    signIn(input: SignInInput!): AuthPayload!
    updateMe(input: UpdateMeInput!): User!

    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!

    createTransaction(input: CreateTransactionInput!): Transaction!
    updateTransaction(id: ID!, input: UpdateTransactionInput!): Transaction!
    deleteTransaction(id: ID!): Boolean!
  }
`
