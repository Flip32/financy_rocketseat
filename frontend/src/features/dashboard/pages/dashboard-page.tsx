import { formatDate } from '../../../lib/formatters'
import { useCategoryVisualStore } from '../../../stores/category-visual-store'
import { useCategories } from '../../categories/hooks/use-categories'
import { resolveCategoryVisual } from '../../categories/lib/category-visuals'
import {
  CardCategoriasDash,
  CardHeaderDash,
  CardTransacoesRecentesDash,
  UiColor,
  UiIcon
} from '../../system/components/ui'
import { useTransactions } from '../../transactions/hooks/use-transactions'

import './dashboard-page.css'

export function DashboardPage() {
  const { categories, loading: categoriesLoading } = useCategories(true)
  const { transactions, loading: transactionsLoading } = useTransactions(true)
  const descriptions = useCategoryVisualStore(state => state.descriptions)

  const orderedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
  })

  const referenceDate = orderedTransactions.length
    ? new Date(orderedTransactions[0].occurredAt)
    : new Date()

  const monthlyTransactions = orderedTransactions.filter(transaction => {
    const occurredAt = new Date(transaction.occurredAt)

    return (
      occurredAt.getMonth() === referenceDate.getMonth() &&
      occurredAt.getFullYear() === referenceDate.getFullYear()
    )
  })

  const monthlyTotals = monthlyTransactions.reduce(
    (accumulator, transaction) => {
      if (transaction.type === 'INCOME') {
        accumulator.income += transaction.amount
      } else {
        accumulator.expense += transaction.amount
      }

      accumulator.balance = accumulator.income - accumulator.expense
      return accumulator
    },
    {
      income: 0,
      expense: 0,
      balance: 0
    }
  )

  const totals = orderedTransactions.reduce(
    (accumulator, transaction) => {
      if (transaction.type === 'INCOME') {
        accumulator.income += transaction.amount
      } else {
        accumulator.expense += transaction.amount
      }

      accumulator.balance = accumulator.income - accumulator.expense
      return accumulator
    },
    {
      income: 0,
      expense: 0,
      balance: 0
    }
  )

  const recentTransactions = orderedTransactions.slice(0, 5)

  const recentTransactionItems = recentTransactions.map(transaction => {
    const visual = resolveCategoryVisual(
      transaction.category,
      descriptions[transaction.category.id]
    )

    return {
      id: transaction.id,
      iconName: visual.icon as UiIcon,
      iconColor: visual.color,
      title: transaction.title,
      subtitle: formatDate(transaction.occurredAt),
      tagLabel: transaction.category.name,
      tagCategory: visual.color,
      amount:
        transaction.type === 'INCOME' ? transaction.amount : -transaction.amount
    }
  })

  const categoryStats = categories
    .map(category => {
      const transactionsByCategory = orderedTransactions.filter(transaction => {
        return transaction.category.id === category.id
      })
      const visual = resolveCategoryVisual(category, descriptions[category.id])
      const totalAmount = transactionsByCategory.reduce(
        (total, transaction) => total + transaction.amount,
        0
      )

      return {
        tagCategory: visual.color,
        tagLabel: category.name,
        itemsCount: transactionsByCategory.length,
        amount: totalAmount
      }
    })
    .sort(
      (firstItem, secondItem) => secondItem.itemsCount - firstItem.itemsCount
    )

  return (
    <section className="dashboard-grid">
      <section className="dashboard-grid-container">
        <CardHeaderDash
          iconName={UiIcon.Wallet}
          iconColor={UiColor.PurpleBase}
          title="Saldo total"
          value={totals.balance}
        />

        <CardHeaderDash
          iconName={UiIcon.CircleArrowUp}
          iconColor={UiColor.BrandBase}
          title="Receitas do mês"
          value={monthlyTotals.income}
        />

        <CardHeaderDash
          iconName={UiIcon.CircleArrowDown}
          iconColor={UiColor.RedBase}
          title="Despesas do mês"
          value={monthlyTotals.expense}
        />
      </section>

      <section className="content-grid dashboard-grid">
        <div className="dashboard-section--recent">
          {transactionsLoading && (
            <article className="surface dashboard-recent-state">
              <p className="loading">Carregando transações...</p>
            </article>
          )}

          {!transactionsLoading && recentTransactionItems.length === 0 && (
            <article className="surface dashboard-recent-state">
              <p className="empty">Nenhuma transação cadastrada.</p>
            </article>
          )}

          {!transactionsLoading && recentTransactionItems.length > 0 && (
            <CardTransacoesRecentesDash items={recentTransactionItems} />
          )}
        </div>

        <section className="dashboard-recent-state">
          {categoriesLoading && (
            <p className="loading">Carregando categorias...</p>
          )}
          {!categoriesLoading && categoryStats.length === 0 && (
            <p className="empty">Nenhuma categoria cadastrada.</p>
          )}
          {!categoriesLoading && categoryStats.length > 0 && (
            <CardCategoriasDash items={categoryStats} />
          )}
        </section>
      </section>
    </section>
  )
}
