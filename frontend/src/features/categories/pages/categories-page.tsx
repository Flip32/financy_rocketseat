import { useMemo, useState } from 'react'

import { useCategoryVisualStore } from '../../../stores/category-visual-store'
import {
  CardCategoryItem,
  CardHeaderCategory,
  PageHeader,
  UiColor,
  UiIcon
} from '../../system/components/ui'
import { useTransactions } from '../../transactions/hooks/use-transactions'
import {
  type CategoryFormData,
  type CategoryFormErrors,
  CategoryFormModal
} from '../components/category-form-modal'
import {
  type CategoryMutationResult,
  useCategories
} from '../hooks/use-categories'
import {
  type CategoryColor,
  resolveCategoryVisual
} from '../lib/category-visuals'
import type { Category } from '../types/category'

import './categories-page.css'

type CategoryModalState = {
  open: boolean
  editingCategory: Category | null
}

function makeDefaultFormData(): CategoryFormData {
  return {
    name: '',
    description: '',
    icon: 'briefcase-business',
    color: 'green'
  }
}

function toStatIconColor(color: CategoryColor | undefined) {
  if (!color || color === 'gray') {
    return UiColor.Gray700
  }

  if (color === 'blue') {
    return UiColor.BlueBase
  }

  if (color === 'purple') {
    return UiColor.PurpleBase
  }

  if (color === 'pink') {
    return UiColor.PinkBase
  }

  if (color === 'red') {
    return UiColor.RedBase
  }

  if (color === 'orange') {
    return UiColor.OrangeBase
  }

  if (color === 'yellow') {
    return UiColor.YellowBase
  }

  return UiColor.GreenBase
}

export function CategoriesPage() {
  const {
    categories,
    loading,
    mutationLoading,
    errorMessage,
    createCategory,
    updateCategory,
    deleteCategory
  } = useCategories(true)

  const { transactions } = useTransactions(true)

  const descriptions = useCategoryVisualStore(state => state.descriptions)
  const setCategoryDescription = useCategoryVisualStore(
    state => state.setCategoryDescription
  )
  const removeCategoryDescription = useCategoryVisualStore(
    state => state.removeCategoryDescription
  )

  const [feedback, setFeedback] = useState<string | null>(null)
  const [formData, setFormData] =
    useState<CategoryFormData>(makeDefaultFormData)
  const [formErrors, setFormErrors] = useState<CategoryFormErrors>({})
  const [modalState, setModalState] = useState<CategoryModalState>({
    open: false,
    editingCategory: null
  })

  const categoryStats = useMemo(() => {
    return categories
      .map(category => {
        const transactionsByCategory = transactions.filter(transaction => {
          return transaction.category.id === category.id
        })

        return {
          category,
          visual: resolveCategoryVisual(category, descriptions[category.id]),
          count: transactionsByCategory.length
        }
      })
      .sort((firstItem, secondItem) => secondItem.count - firstItem.count)
  }, [categories, transactions, descriptions])

  const orderedCategoryCards = useMemo(() => {
    return [...categoryStats].sort((firstItem, secondItem) => {
      return (
        new Date(firstItem.category.createdAt).getTime() -
        new Date(secondItem.category.createdAt).getTime()
      )
    })
  }, [categoryStats])

  const mostUsedCategory = categoryStats[0] ?? null

  const modalTitle = modalState.editingCategory
    ? 'Editar categoria'
    : 'Nova categoria'

  function openCreateModal() {
    setFeedback(null)
    setFormErrors({})
    setFormData(makeDefaultFormData())
    setModalState({
      open: true,
      editingCategory: null
    })
  }

  function openEditModal(category: Category) {
    setFeedback(null)
    setFormErrors({})

    const visual = resolveCategoryVisual(category, descriptions[category.id])

    setFormData({
      name: category.name,
      description: descriptions[category.id] ?? '',
      color: visual.color,
      icon: visual.icon
    })

    setModalState({
      open: true,
      editingCategory: category
    })
  }

  function closeModal() {
    setFormErrors({})
    setModalState({
      open: false,
      editingCategory: null
    })
  }

  function updateForm<K extends keyof CategoryFormData>(
    key: K,
    value: CategoryFormData[K]
  ) {
    setFormErrors(current => ({
      ...current,
      [key]: undefined,
      general: undefined
    }))

    setFormData(current => ({
      ...current,
      [key]: value
    }))
  }

  function mapCategoryErrors(message: string | null): CategoryFormErrors {
    if (!message) {
      return {
        general: 'Não foi possível salvar a categoria.'
      }
    }

    const normalizedMessage = message.toLowerCase()

    if (
      normalizedMessage.includes('título') ||
      normalizedMessage.includes('nome') ||
      normalizedMessage.includes('at least 1 character') ||
      normalizedMessage.includes('at most 80 character')
    ) {
      return {
        name: message
      }
    }

    if (
      normalizedMessage.includes('ícone') ||
      normalizedMessage.includes('icone') ||
      normalizedMessage.includes('icon') ||
      normalizedMessage.includes('iconprops')
    ) {
      return {
        icon: message
      }
    }

    if (
      normalizedMessage.includes('cor') ||
      normalizedMessage.includes('color')
    ) {
      return {
        color: message
      }
    }

    return {
      general: message
    }
  }

  async function persistCategory(
    resultPromise: Promise<CategoryMutationResult>
  ): Promise<Category | null> {
    const result = await resultPromise

    if (!result.success) {
      setFormErrors(mapCategoryErrors(result.message))
      return null
    }

    setFormErrors({})
    setFeedback(null)
    return result.category ?? null
  }

  function syncCategoryDescription(categoryId: string) {
    const description = formData.description.trim()

    if (description) {
      setCategoryDescription(categoryId, description)
      return
    }

    removeCategoryDescription(categoryId)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedName = formData.name.trim()

    if (!normalizedName) {
      setFormErrors({
        name: 'Informe o título da categoria.'
      })
      return
    }

    if (modalState.editingCategory) {
      const updatedCategory = await persistCategory(
        updateCategory(modalState.editingCategory.id, {
          name: normalizedName,
          iconProps: {
            name: formData.icon,
            color: formData.color
          }
        })
      )

      if (!updatedCategory) {
        return
      }

      syncCategoryDescription(updatedCategory.id)
      closeModal()
      return
    }

    const createdCategory = await persistCategory(
      createCategory({
        name: normalizedName,
        iconProps: {
          name: formData.icon,
          color: formData.color
        }
      })
    )

    if (!createdCategory) {
      return
    }

    syncCategoryDescription(createdCategory.id)
    closeModal()
  }

  async function handleDeleteCategory(categoryId: string) {
    const confirmed = window.confirm('Deseja excluir esta categoria?')

    if (!confirmed) {
      return
    }

    const result = await deleteCategory(categoryId)

    if (!result.success) {
      setFeedback(result.message)
      return
    }

    removeCategoryDescription(categoryId)
    setFeedback(null)
  }

  return (
    <>
      <section className="section-stack section-stack--categories">
        <PageHeader
          title="Categorias"
          description="Organize suas transações por categorias"
          label="Nova categoria"
          onActionClick={openCreateModal}
        />

        <section className="stats-grid stats-grid--categories">
          <CardHeaderCategory
            iconName={UiIcon.Tag}
            value={categories.length}
            title="Total de categorias"
          />

          <CardHeaderCategory
            iconName={UiIcon.ArrowUpDown}
            iconColor={UiColor.PurpleBase}
            value={transactions.length}
            title="Total de transações"
          />

          <CardHeaderCategory
            iconName={
              mostUsedCategory
                ? (mostUsedCategory.visual.icon as UiIcon)
                : UiIcon.Tag
            }
            iconColor={toStatIconColor(mostUsedCategory?.visual.color)}
            value={
              mostUsedCategory ? mostUsedCategory.category.name : 'Sem dados'
            }
            title="Categoria mais utilizada"
          />
        </section>

        {loading && <p className="loading">Carregando categorias...</p>}

        {!loading && categoryStats.length === 0 && (
          <p className="empty">Nenhuma categoria cadastrada.</p>
        )}

        {!loading && categoryStats.length > 0 && (
          <section className="category-grid">
            {orderedCategoryCards.map(({ category, visual, count }) => (
              <CardCategoryItem
                key={category.id}
                iconName={visual.icon as UiIcon}
                iconColor={visual.color}
                title={category.name}
                description={visual.description}
                tagLabel={category.name}
                tagCategory={visual.color}
                itemsCount={count}
                onDeleteClick={() => handleDeleteCategory(category.id)}
                onEditClick={() => openEditModal(category)}
              />
            ))}
          </section>
        )}

        {(feedback || errorMessage) && (
          <p className="feedback">{feedback || errorMessage}</p>
        )}
      </section>

      <CategoryFormModal
        open={modalState.open}
        title={modalTitle}
        mutationLoading={mutationLoading}
        formData={formData}
        formErrors={formErrors}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onFormChange={updateForm}
      />
    </>
  )
}
