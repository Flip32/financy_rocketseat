import { useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'

import { useAuthStore } from '../../../stores/auth-store'
import { Logo } from '../../system/components/ui'
import { AuthForm, type AuthMode } from '../components/auth-form'

import './auth-page.css'

export function AuthPage() {
  const token = useAuthStore(state => state.token)
  const setToken = useAuthStore(state => state.setToken)
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  const currentMode =
    searchParams.get('mode') === 'signup' ? 'signup' : 'signin'

  function handleAuthenticated(tokenValue: string, rememberMe: boolean) {
    setToken(tokenValue, rememberMe)
    setFeedback(null)
    navigate('/dashboard', { replace: true })
  }

  function handleModeChange(mode: AuthMode) {
    setFeedback(null)

    if (mode === 'signup') {
      setSearchParams({ mode: 'signup' })
      return
    }

    setSearchParams({})
  }

  return (
    <main className="app-shell">
      <section className="app-frame auth-page">
        <section className="auth-page__content">
          <Logo className="auth-page__logo" />

          <section
            className={`surface auth-page__card ${
              currentMode === 'signin'
                ? 'auth-page__card--signin'
                : 'auth-page__card--signup'
            }`}
          >
            <header className="auth-page__header">
              <h1 className="auth-page__title">
                {currentMode === 'signin' ? 'Fazer login' : 'Criar conta'}
              </h1>
              <p className="auth-page__subtitle">
                {currentMode === 'signin'
                  ? 'Entre na sua conta para continuar'
                  : 'Comece a controlar suas finanças ainda hoje'}
              </p>
            </header>

            {feedback && <p className="feedback">{feedback}</p>}

            <AuthForm
              mode={currentMode}
              onModeChange={handleModeChange}
              onAuthenticated={handleAuthenticated}
              onFeedback={setFeedback}
            />
          </section>
        </section>
      </section>
    </main>
  )
}
