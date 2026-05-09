import { gql } from '@apollo/client'

export const TRANSACTIONS_QUERY = gql`
  query Transactions {
    transactions {
      id
      title
      amount
      type
      occurredAt
      description
      createdAt
      updatedAt
      category {
        id
        name
        iconProps {
          name
          color
        }
        createdAt
        updatedAt
      }
    }
  }
`

export const CREATE_TRANSACTION_MUTATION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      title
      amount
      type
      occurredAt
      description
      createdAt
      updatedAt
      category {
        id
        name
        iconProps {
          name
          color
        }
        createdAt
        updatedAt
      }
    }
  }
`

export const UPDATE_TRANSACTION_MUTATION = gql`
  mutation UpdateTransaction($id: ID!, $input: UpdateTransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      id
      title
      amount
      type
      occurredAt
      description
      createdAt
      updatedAt
      category {
        id
        name
        iconProps {
          name
          color
        }
        createdAt
        updatedAt
      }
    }
  }
`

export const DELETE_TRANSACTION_MUTATION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`
