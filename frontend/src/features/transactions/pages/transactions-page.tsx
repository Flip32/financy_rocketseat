import { useEffect, useMemo, useState } from 'react'

import { formatDate, formatMonth } from '../../../lib/formatters'
import { useCategories } from '../../categories/hooks/use-categories'
import { resolveCategoryVisual } from '../../categories/lib/category-visuals'
import {
  CardTransactions,
  PageHeader,
  TransactionMenu,
  type UiIcon
} from '../../system/components/ui'
import {
  type TransactionFormErrors,
  TransactionFormModal
} from '../components/transaction-form-modal'
import {
  type CreateTransactionInput,
  type TransactionMutationResult,
  useTransactions
} from '../hooks/use-transactions'
import type { Transaction, TransactionType } from '../types/transaction'

import './transactions-page.css'

type TransactionFormData = {
  title: string
  amount: string
  type: TransactionType
  occurredAt: string
  description: string
  categoryId: string
}

type TransactionModalState = {
  open: boolean
  editingTransaction: Transaction | null
}

type TransactionTypeFilter = TransactionType | 'ALL'
type TransactionFormValidationResult = {
  input: CreateTransactionInput | null
  errors: TransactionFormErrors
}

const transactionsPerPage = 10

function nowAsDateTimeLocal() {
  const now = new Date()
  const timezoneOffset = now.getTimezoneOffset() * 60000

  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 16)
}

function isoToDateTimeLocal(isoDate: string) {
  const date = new Date(isoDate)
  const timezoneOffset = date.getTimezoneOffset() * 60000

  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16)
}

function toMonthValue(dateString: string) {
  const date = new Date(dateString)
  const month = String(date.getMonth() + 1).padStart(2, '0')

  return `${date.getFullYear()}-${month}`
}

function formatAmountInput(value: string) {
  const digits = value.replace(/\D/g, '')

  if (!digits) {
    return ''
  }

  const amount = Number(digits) / 100

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

function formatAmountFromNumber(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

function parseAmountInput(value: string) {
  const normalized = value
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
    .replace(/[^\d.]/g, '')

  return Number(normalized)
}

function makeDefaultFormData(): TransactionFormData {
  return {
    title: '',
    amount: '',
    type: 'EXPENSE',
    occurredAt: nowAsDateTimeLocal(),
    description: '',
    categoryId: ''
  }
}

function validateTransactionForm(
  formData: TransactionFormData
): TransactionFormValidationResult {
  const title = formData.title.trim()
  const amount = parseAmountInput(formData.amount)
  const occurredAt = formData.occurredAt
  const errors: TransactionFormErrors = {}

  if (!title) {
    errors.title = 'Informe a descrição da transação.'
  }

  if (!occurredAt || Number.isNaN(new Date(occurredAt).getTime())) {
    errors.occurredAt = 'Informe uma data válida.'
  }

  if (!formData.amount.trim()) {
    errors.amount = 'Informe o valor da transação.'
  } else if (Number.isNaN(amount) || amount <= 0) {
    errors.amount = 'Informe um valor maior que zero.'
  }

  if (!formData.categoryId) {
    errors.categoryId = 'Selecione uma categoria.'
  }

  if (Object.keys(errors).length > 0) {
    return {
      input: null,
      errors
    }
  }

  return {
    input: {
      title,
      amount,
      type: formData.type,
      occurredAt: new Date(occurredAt).toISOString(),
      description: formData.description.trim() || null,
      categoryId: formData.categoryId
    },
    errors: {}
  }
}

function mapTransactionFormErrors(
  message: string | null
): TransactionFormErrors {
  if (!message) {
    return {
      general: 'Não foi possível salvar a transação.'
    }
  }

  const normalizedMessage = message.toLowerCase()

  if (
    normalizedMessage.includes('descrição') ||
    normalizedMessage.includes('titulo') ||
    normalizedMessage.includes('título') ||
    normalizedMessage.includes('title') ||
    normalizedMessage.includes('at least 1 character') ||
    normalizedMessage.includes('at most 120 character')
  ) {
    return {
      title: message
    }
  }

  if (
    normalizedMessage.includes('valor') ||
    normalizedMessage.includes('amount') ||
    normalizedMessage.includes('greater than 0') ||
    normalizedMessage.includes('positive')
  ) {
    return {
      amount: message
    }
  }

  if (normalizedMessage.includes('data')) {
    return {
      occurredAt: message
    }
  }

  if (normalizedMessage.includes('categoria')) {
    return {
      categoryId: message
    }
  }

  return {
    general: message
  }
}

export function TransactionsPage() {
  const {
    categories,
    loading: categoriesLoading,
    errorMessage: categoriesErrorMessage
  } = useCategories(true)

  const {
    transactions,
    loading: transactionsLoading,
    errorMessage: transactionsErrorMessage,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    mutationLoading
  } = useTransactions(true)

  const [feedback, setFeedback] = useState<string | null>(null)
  const [modalState, setModalState] = useState<TransactionModalState>({
    open: false,
    editingTransaction: null
  })
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>('ALL')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [periodFilter, setPeriodFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)

  const [formData, setFormData] = useState<TransactionFormData>(
    makeDefaultFormData()
  )
  const [formErrors, setFormErrors] = useState<TransactionFormErrors>({})

  const orderedTransactions = useMemo(() => {
    return [...transactions].sort((firstItem, secondItem) => {
      return (
        new Date(secondItem.occurredAt).getTime() -
        new Date(firstItem.occurredAt).getTime()
      )
    })
  }, [transactions])

  const categoriesSortedForSelect = useMemo(() => {
    return [...categories].sort((firstItem, secondItem) => {
      return firstItem.name.localeCompare(secondItem.name, 'pt-BR', {
        sensitivity: 'base'
      })
    })
  }, [categories])

  const periodOptions = useMemo(() => {
    const months = new Set<string>()

    for (const transaction of orderedTransactions) {
      months.add(toMonthValue(transaction.occurredAt))
    }

    const options = Array.from(months).sort((first, second) => {
      return second.localeCompare(first)
    })

    if (!options.length) {
      const currentDate = new Date()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      options.push(`${currentDate.getFullYear()}-${month}`)
    }

    return ['ALL', ...options]
  }, [orderedTransactions])

  useEffect(() => {
    if (!periodOptions.length) {
      return
    }

    if (periodFilter && periodOptions.includes(periodFilter)) {
      return
    }

    setPeriodFilter(periodOptions[0])
  }, [periodFilter, periodOptions])

  const filteredTransactions = useMemo(() => {
    return orderedTransactions.filter(transaction => {
      const searchText =
        `${transaction.title} ${transaction.description ?? ''} ${transaction.category.name}`
          .toLowerCase()
          .trim()

      const matchesSearch = search
        ? searchText.includes(search.toLowerCase().trim())
        : true

      const matchesType =
        typeFilter === 'ALL' ? true : transaction.type === typeFilter

      const matchesCategory =
        categoryFilter === 'ALL'
          ? true
          : transaction.category.id === categoryFilter

      const matchesPeriod =
        periodFilter && periodFilter !== 'ALL'
          ? toMonthValue(transaction.occurredAt) === periodFilter
          : true

      return matchesSearch && matchesType && matchesCategory && matchesPeriod
    })
  }, [orderedTransactions, search, typeFilter, categoryFilter, periodFilter])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / transactionsPerPage)
  )

  useEffect(() => {
    if (currentPage <= totalPages) {
      return
    }

    setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  )

  const transactionsItems = useMemo(() => {
    return paginatedTransactions.map(transaction => {
      const visual = resolveCategoryVisual(transaction.category, undefined)

      return {
        id: transaction.id,
        description: transaction.title,
        date: formatDate(transaction.occurredAt),
        categoryLabel: transaction.category.name,
        categoryColor: visual.color,
        categoryIconName: visual.icon as UiIcon,
        categoryIconColor: visual.color,
        type: transaction.type === 'INCOME' ? 'Income' : 'Expense',
        amount: transaction.amount
      } as const
    })
  }, [paginatedTransactions])

  const resultsLabel = useMemo(() => {
    if (!filteredTransactions.length) {
      return '0 resultados'
    }

    const start = (currentPage - 1) * transactionsPerPage + 1
    const end = Math.min(
      currentPage * transactionsPerPage,
      filteredTransactions.length
    )

    return `${start} a ${end} | ${filteredTransactions.length} resultados`
  }, [currentPage, filteredTransactions.length])

  useEffect(() => {
    if (!categories.length) {
      return
    }

    if (modalState.editingTransaction) {
      return
    }

    const hasCurrentCategory = categories.some(
      category => category.id === formData.categoryId
    )

    if (hasCurrentCategory) {
      return
    }

    setFormData(current => ({
      ...current
    }))
  }, [categories, formData.categoryId, modalState.editingTransaction])

  function openCreateModal() {
    if (!categories.length) {
      setFeedback('Crie uma categoria antes de cadastrar transações.')
      return
    }

    setFeedback(null)
    setFormErrors({})
    setFormData(makeDefaultFormData())
    setModalState({
      open: true,
      editingTransaction: null
    })
  }

  function openEditModal(transaction: Transaction) {
    setFeedback(null)
    setFormErrors({})
    setFormData({
      title: transaction.title,
      amount: formatAmountFromNumber(transaction.amount),
      type: transaction.type,
      occurredAt: isoToDateTimeLocal(transaction.occurredAt),
      description: transaction.description ?? '',
      categoryId: transaction.category.id
    })
    setModalState({
      open: true,
      editingTransaction: transaction
    })
  }

  function closeModal() {
    setFormErrors({})
    setModalState({
      open: false,
      editingTransaction: null
    })
  }

  function handleInputChange<K extends keyof TransactionFormData>(
    field: K,
    value: TransactionFormData[K]
  ) {
    setFormErrors(current => {
      if (
        field === 'title' ||
        field === 'occurredAt' ||
        field === 'categoryId'
      ) {
        return {
          ...current,
          [field]: undefined,
          general: undefined
        }
      }

      return {
        ...current,
        general: undefined
      }
    })

    setFormData(current => ({
      ...current,
      [field]: value
    }))
  }

  function handleAmountInputChange(value: string) {
    setFormErrors(current => ({
      ...current,
      amount: undefined,
      general: undefined
    }))

    setFormData(current => ({
      ...current,
      amount: formatAmountInput(value)
    }))
  }

  async function persistTransactionFromForm(
    resultPromise: Promise<TransactionMutationResult>
  ): Promise<boolean> {
    const result = await resultPromise

    if (!result.success) {
      setFormErrors(mapTransactionFormErrors(result.message))
      return false
    }

    setFormErrors({})
    setFeedback(null)
    return true
  }

  async function persistTransactionFeedback(
    resultPromise: Promise<TransactionMutationResult>
  ): Promise<boolean> {
    const result = await resultPromise

    if (!result.success) {
      setFeedback(result.message)
      return false
    }

    setFeedback(null)
    return true
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validation = validateTransactionForm(formData)

    if (!validation.input) {
      setFormErrors(validation.errors)
      return
    }

    setFormErrors({})

    if (modalState.editingTransaction) {
      const success = await persistTransactionFromForm(
        updateTransaction(modalState.editingTransaction.id, validation.input)
      )

      if (success) {
        closeModal()
      }

      return
    }

    const success = await persistTransactionFromForm(
      createTransaction(validation.input)
    )

    if (success) {
      closeModal()
    }
  }

  async function handleDeleteTransaction(transactionId: string) {
    const confirmed = window.confirm('Deseja excluir esta transação?')

    if (!confirmed) {
      return
    }

    const success = await persistTransactionFeedback(
      deleteTransaction(transactionId)
    )

    if (!success) {
      return
    }

    if (modalState.editingTransaction?.id === transactionId) {
      closeModal()
    }
  }

  return (
    <>
      <section className="transactions-page">
        <PageHeader
          title="Transações"
          description="Gerencie todas as suas transações financeiras"
          label="Nova transação"
          onActionClick={openCreateModal}
          actionDisabled={!categories.length}
        />

        <TransactionMenu
          searchValue={search}
          onSearchValueChange={value => {
            setSearch(value)
            setCurrentPage(1)
          }}
          typeValue={typeFilter}
          onTypeValueChange={value => {
            setTypeFilter(value as TransactionTypeFilter)
            setCurrentPage(1)
          }}
          typeOptions={[
            { value: 'ALL', label: 'Todos' },
            { value: 'INCOME', label: 'Entrada' },
            { value: 'EXPENSE', label: 'Saída' }
          ]}
          categoryValue={categoryFilter}
          onCategoryValueChange={value => {
            setCategoryFilter(value)
            setCurrentPage(1)
          }}
          categoryOptions={[
            { value: 'ALL', label: 'Todas' },
            ...categoriesSortedForSelect.map(category => ({
              value: category.id,
              label: category.name
            }))
          ]}
          periodValue={periodFilter}
          onPeriodValueChange={value => {
            setPeriodFilter(value)
            setCurrentPage(1)
          }}
          periodOptions={periodOptions.map(option => ({
            value: option,
            label: option === 'ALL' ? 'Todos' : formatMonth(option)
          }))}
        />

        {(categoriesLoading || transactionsLoading) && (
          <p className="transactions-page__state">Carregando dados...</p>
        )}

        {!transactionsLoading && filteredTransactions.length === 0 && (
          <p className="transactions-page__state">
            Nenhuma transação encontrada.
          </p>
        )}

        {!transactionsLoading && filteredTransactions.length > 0 && (
          <CardTransactions
            items={transactionsItems}
            currentPage={currentPage}
            totalPages={totalPages}
            resultsLabel={resultsLabel}
            onPageChange={page =>
              setCurrentPage(Math.min(Math.max(page, 1), totalPages))
            }
            onEditItem={item => {
              const selectedTransaction = paginatedTransactions.find(
                transaction => transaction.id === item.id
              )

              if (selectedTransaction) {
                openEditModal(selectedTransaction)
              }
            }}
            onDeleteItem={item => handleDeleteTransaction(item.id)}
          />
        )}

        {(feedback || categoriesErrorMessage || transactionsErrorMessage) && (
          <p className="transactions-page__feedback">
            {feedback || categoriesErrorMessage || transactionsErrorMessage}
          </p>
        )}
      </section>

      <TransactionFormModal
        open={modalState.open}
        title={
          modalState.editingTransaction ? 'Editar transação' : 'Nova transação'
        }
        mutationLoading={mutationLoading}
        formData={{
          title: formData.title,
          amount: formData.amount,
          type: formData.type,
          occurredAt: formData.occurredAt,
          categoryId: formData.categoryId
        }}
        formErrors={formErrors}
        categoryOptions={[
          { value: '', label: 'Selecione' },
          ...categoriesSortedForSelect.map(category => ({
            value: category.id,
            label: category.name
          }))
        ]}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onTypeChange={value => handleInputChange('type', value)}
        onTitleChange={value => handleInputChange('title', value)}
        onOccurredAtChange={value => handleInputChange('occurredAt', value)}
        onAmountChange={handleAmountInputChange}
        onCategoryChange={value => handleInputChange('categoryId', value)}
      />
    </>
  )
}
