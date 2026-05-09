import { useMutation, useQuery } from '@apollo/client'

import { getGraphQLErrorMessage } from '../../../lib/graphql-error'
import {
  CREATE_TRANSACTION_MUTATION,
  DELETE_TRANSACTION_MUTATION,
  TRANSACTIONS_QUERY,
  UPDATE_TRANSACTION_MUTATION
} from '../graphql/transactions-documents'
import type { Transaction, TransactionType } from '../types/transaction'

type TransactionsQueryData = {
  transactions: Transaction[]
}

type CreateTransactionMutationData = {
  createTransaction: Transaction
}

type UpdateTransactionMutationData = {
  updateTransaction: Transaction
}

type DeleteTransactionMutationData = {
  deleteTransaction: boolean
}

export type CreateTransactionInput = {
  title: string
  amount: number
  type: TransactionType
  occurredAt: string
  description?: string | null
  categoryId: string
}

export type UpdateTransactionInput = Partial<CreateTransactionInput>

export type TransactionMutationResult = {
  success: boolean
  message: string | null
}

export function useTransactions(enabled: boolean) {
  const {
    data,
    loading,
    error,
    refetch: refetchTransactions
  } = useQuery<TransactionsQueryData>(TRANSACTIONS_QUERY, {
    skip: !enabled,
    fetchPolicy: 'network-only'
  })

  const [createTransactionMutation, { loading: createLoading }] =
    useMutation<CreateTransactionMutationData>(CREATE_TRANSACTION_MUTATION)

  const [updateTransactionMutation, { loading: updateLoading }] =
    useMutation<UpdateTransactionMutationData>(UPDATE_TRANSACTION_MUTATION)

  const [deleteTransactionMutation, { loading: deleteLoading }] =
    useMutation<DeleteTransactionMutationData>(DELETE_TRANSACTION_MUTATION)

  async function createTransaction(
    input: CreateTransactionInput
  ): Promise<TransactionMutationResult> {
    try {
      const response = await createTransactionMutation({
        variables: { input },
        refetchQueries: [{ query: TRANSACTIONS_QUERY }]
      })

      if (!response.data?.createTransaction) {
        return { success: false, message: 'Não foi possível criar transação.' }
      }

      return { success: true, message: null }
    } catch (mutationError) {
      return {
        success: false,
        message: getGraphQLErrorMessage(mutationError)
      }
    }
  }

  async function updateTransaction(
    id: string,
    input: UpdateTransactionInput
  ): Promise<TransactionMutationResult> {
    try {
      const response = await updateTransactionMutation({
        variables: { id, input },
        refetchQueries: [{ query: TRANSACTIONS_QUERY }]
      })

      if (!response.data?.updateTransaction) {
        return {
          success: false,
          message: 'Não foi possível atualizar transação.'
        }
      }

      return { success: true, message: null }
    } catch (mutationError) {
      return {
        success: false,
        message: getGraphQLErrorMessage(mutationError)
      }
    }
  }

  async function deleteTransaction(
    id: string
  ): Promise<TransactionMutationResult> {
    try {
      const response = await deleteTransactionMutation({
        variables: { id },
        refetchQueries: [{ query: TRANSACTIONS_QUERY }]
      })

      if (!response.data?.deleteTransaction) {
        return {
          success: false,
          message: 'Não foi possível excluir transação.'
        }
      }

      return { success: true, message: null }
    } catch (mutationError) {
      return {
        success: false,
        message: getGraphQLErrorMessage(mutationError)
      }
    }
  }

  return {
    transactions: data?.transactions ?? [],
    loading,
    errorMessage: error ? getGraphQLErrorMessage(error) : null,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refetchTransactions,
    mutationLoading: createLoading || updateLoading || deleteLoading
  }
}
