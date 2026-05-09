import { useMutation, useQuery } from '@apollo/client'

import { getGraphQLErrorMessage } from '../../../lib/graphql-error'
import { TRANSACTIONS_QUERY } from '../../transactions/graphql/transactions-documents'
import {
  CATEGORIES_QUERY,
  CREATE_CATEGORY_MUTATION,
  DELETE_CATEGORY_MUTATION,
  UPDATE_CATEGORY_MUTATION
} from '../graphql/categories-documents'
import type { Category } from '../types/category'

type CategoriesQueryData = {
  categories: Category[]
}

type CreateCategoryMutationData = {
  createCategory: Category
}

type UpdateCategoryMutationData = {
  updateCategory: Category
}

type DeleteCategoryMutationData = {
  deleteCategory: boolean
}

export type CategoryIconPropsInput = {
  name: string
  color: string
}

export type UpsertCategoryInput = {
  name: string
  iconProps: CategoryIconPropsInput
}

export type CategoryMutationResult = {
  success: boolean
  message: string | null
  category?: Category
}

function normalizeUpsertCategoryInput(
  input: string | UpsertCategoryInput
): UpsertCategoryInput {
  if (typeof input !== 'string') {
    return input
  }

  return {
    name: input,
    iconProps: {
      name: 'paw-print',
      color: 'gray'
    }
  }
}

export function useCategories(enabled: boolean) {
  const {
    data,
    loading,
    error,
    refetch: refetchCategories
  } = useQuery<CategoriesQueryData>(CATEGORIES_QUERY, {
    skip: !enabled,
    fetchPolicy: 'network-only'
  })

  const [createCategoryMutation, { loading: createLoading }] =
    useMutation<CreateCategoryMutationData>(CREATE_CATEGORY_MUTATION)

  const [updateCategoryMutation, { loading: updateLoading }] =
    useMutation<UpdateCategoryMutationData>(UPDATE_CATEGORY_MUTATION)

  const [deleteCategoryMutation, { loading: deleteLoading }] =
    useMutation<DeleteCategoryMutationData>(DELETE_CATEGORY_MUTATION)

  async function createCategory(
    input: string | UpsertCategoryInput
  ): Promise<CategoryMutationResult> {
    const payload = normalizeUpsertCategoryInput(input)

    try {
      const response = await createCategoryMutation({
        variables: {
          input: payload
        },
        refetchQueries: [{ query: CATEGORIES_QUERY }]
      })

      if (!response.data?.createCategory) {
        return { success: false, message: 'Não foi possível criar categoria.' }
      }

      return {
        success: true,
        message: null,
        category: response.data.createCategory
      }
    } catch (mutationError) {
      return {
        success: false,
        message: getGraphQLErrorMessage(mutationError)
      }
    }
  }

  async function updateCategory(
    id: string,
    input: string | UpsertCategoryInput
  ): Promise<CategoryMutationResult> {
    const payload = normalizeUpsertCategoryInput(input)

    try {
      const response = await updateCategoryMutation({
        variables: {
          id,
          input: payload
        },
        refetchQueries: [
          { query: CATEGORIES_QUERY },
          { query: TRANSACTIONS_QUERY }
        ]
      })

      if (!response.data?.updateCategory) {
        return {
          success: false,
          message: 'Não foi possível atualizar categoria.'
        }
      }

      return {
        success: true,
        message: null,
        category: response.data.updateCategory
      }
    } catch (mutationError) {
      return {
        success: false,
        message: getGraphQLErrorMessage(mutationError)
      }
    }
  }

  async function deleteCategory(id: string): Promise<CategoryMutationResult> {
    try {
      const response = await deleteCategoryMutation({
        variables: { id },
        refetchQueries: [{ query: CATEGORIES_QUERY }]
      })

      if (!response.data?.deleteCategory) {
        return {
          success: false,
          message: 'Não foi possível excluir categoria.'
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
    categories: data?.categories ?? [],
    loading,
    errorMessage: error ? getGraphQLErrorMessage(error) : null,
    createCategory,
    updateCategory,
    deleteCategory,
    refetchCategories,
    mutationLoading: createLoading || updateLoading || deleteLoading
  }
}
