import { NetworkStatus, useQuery } from '@apollo/client'
import { useEffect } from 'react'
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom'

import { ME_QUERY } from './features/auth/graphql/auth-documents'
import { AccountPage } from './features/auth/pages/account-page'
import { AuthPage } from './features/auth/pages/auth-page'
import type { AuthUser } from './features/auth/types/user'
import { CategoriesPage } from './features/categories/pages/categories-page'
import { DashboardPage } from './features/dashboard/pages/dashboard-page'
import { AppLayout } from './features/system/components/app-layout'
import { LabelButton } from './features/system/components/ui'
import { HEALTH_QUERY } from './features/system/graphql/health.query'
import { TransactionsPage } from './features/transactions/pages/transactions-page'
import { getGraphQLErrorMessage } from './lib/graphql-error'
import { useAuthStore } from './stores/auth-store'
import { useCategoryVisualStore } from './stores/category-visual-store'

import './App.css'

type MeQueryData = {
  me: AuthUser | null
}

type HealthQueryData = {
  health: string
}

function RequireAuth() {
  const token = useAuthStore(state => state.token)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/auth" replace state={{ from: location }} />
  }

  return <Outlet />
}

function ProtectedLayout() {
  const clearAuth = useAuthStore(state => state.clear)
  const clearCategoryVisuals = useCategoryVisualStore(state => state.clear)
  const navigate = useNavigate()

  const {
    data: meData,
    loading: meLoading,
    error: meError
  } = useQuery<MeQueryData>(ME_QUERY, {
    fetchPolicy: 'network-only'
  })

  useEffect(() => {
    if (!meError) {
      return
    }

    const hasUnauthorizedCode = meError.graphQLErrors.some(
      item => item.extensions?.code === 'UNAUTHENTICATED'
    )

    if (!hasUnauthorizedCode) {
      return
    }

    clearAuth()
    clearCategoryVisuals()
    navigate('/auth', { replace: true })
  }, [meError, clearAuth, clearCategoryVisuals, navigate])

  return (
    <AppLayout user={meData?.me ?? null} loadingUser={meLoading}>
      <Outlet />
    </AppLayout>
  )
}

function RootRedirect() {
  const token = useAuthStore(state => state.token)

  return <Navigate to={token ? '/dashboard' : '/auth'} replace />
}

function NotFoundRedirect() {
  const token = useAuthStore(state => state.token)

  return <Navigate to={token ? '/dashboard' : '/auth'} replace />
}

type HealthCheckStateProps = {
  loading: boolean
  message: string
  canRetry: boolean
  onRetry: () => void
}

function HealthCheckState({
  loading,
  message,
  canRetry,
  onRetry
}: HealthCheckStateProps) {
  return (
    <main className="app-shell">
      <section className="app-frame app-health">
        <section className="surface app-health__card">
          <h1 className="app-health__title">
            {loading ? 'Conectando com a API' : 'API indisponível'}
          </h1>
          <p className="app-health__description">{message}</p>

          {!loading && canRetry ? (
            <div className="app-health__actions">
              <LabelButton size="Sm" onClick={onRetry}>
                Tentar novamente
              </LabelButton>
            </div>
          ) : null}
        </section>
      </section>
    </main>
  )
}

export function App() {
  const {
    data: healthData,
    loading: healthLoading,
    error: healthError,
    refetch: refetchHealth,
    networkStatus
  } = useQuery<HealthQueryData>(HEALTH_QUERY, {
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true
  })

  const isRefetching = networkStatus === NetworkStatus.refetch
  const normalizedHealth = healthData?.health?.trim().toLowerCase()
  const isHealthy = normalizedHealth === 'ok'

  if (healthLoading && !healthData) {
    return (
      <HealthCheckState
        loading
        message="Validando a conexão com o servidor..."
        canRetry={false}
        onRetry={() => {}}
      />
    )
  }

  if (healthError || !isHealthy) {
    const fallbackMessage = 'Não foi possível conectar ao servidor.'
    const errorMessage = healthError
      ? getGraphQLErrorMessage(healthError)
      : `Resposta inesperada da API: ${healthData?.health ?? 'vazia'}.`

    return (
      <HealthCheckState
        loading={isRefetching}
        message={isRefetching ? fallbackMessage : errorMessage}
        canRetry={!isRefetching}
        onRetry={() => {
          void refetchHealth()
        }}
      />
    )
  }

  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/auth" element={<AuthPage />} />

      <Route element={<RequireAuth />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  )
}
