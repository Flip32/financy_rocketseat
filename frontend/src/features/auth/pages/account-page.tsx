import { Mail, User } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useMutation, useQuery } from '@apollo/client'
import { getGraphQLErrorMessage } from '../../../lib/graphql-error'
import { useAuthStore } from '../../../stores/auth-store'
import { useCategoryVisualStore } from '../../../stores/category-visual-store'

import { getCategoryInitials } from '../../categories/lib/category-visuals'
import { Input, LabelButton, UiColor, UiIcon } from '../../system/components/ui'
import { ME_QUERY, UPDATE_ME_MUTATION } from '../graphql/auth-documents'
import type { AuthUser } from '../types/user'

import './account-page.css'

type MeQueryData = {
  me: AuthUser | null
}

type UpdateMeMutationData = {
  updateMe: AuthUser
}

type UpdateMeMutationVariables = {
  input: {
    name: string
  }
}

type FeedbackState = {
  message: string
  tone: 'success' | 'error'
}

export function AccountPage() {
  const clearAuth = useAuthStore(state => state.clear)
  const clearCategoryVisuals = useCategoryVisualStore(state => state.clear)
  const navigate = useNavigate()
  const { data, loading } = useQuery<MeQueryData>(ME_QUERY, {
    fetchPolicy: 'network-only'
  })
  const [updateMe, { loading: isSaving }] = useMutation<
    UpdateMeMutationData,
    UpdateMeMutationVariables
  >(UPDATE_ME_MUTATION)

  const [name, setName] = useState('')
  const [nameError, setNameError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)

  useEffect(() => {
    if (!data?.me) {
      return
    }

    setName(data.me.name)
  }, [data?.me])

  const email = data?.me?.email ?? 'conta@teste.com'
  const initials = useMemo(() => {
    if (!data?.me?.name) {
      return 'CT'
    }

    return getCategoryInitials(data.me.name)
  }, [data?.me?.name])

  const hasNameChanged = Boolean(
    data?.me && name.trim() !== data.me.name.trim()
  )

  function handleNameChange(value: string) {
    setName(value)
    setNameError(null)

    if (feedback) {
      setFeedback(null)
    }
  }

  function handleLogout() {
    clearAuth()
    clearCategoryVisuals()
    navigate('/auth', { replace: true })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!hasNameChanged || !data?.me) {
      setNameError(null)
      setFeedback(null)
      return
    }

    const nextName = name.trim()
    setNameError(null)

    try {
      await updateMe({
        variables: {
          input: {
            name: nextName
          }
        },
        refetchQueries: [{ query: ME_QUERY }],
        awaitRefetchQueries: true
      })

      setName(nextName)
      setFeedback({
        message: 'Alterações salvas com sucesso.',
        tone: 'success'
      })
    } catch (error) {
      const message = getGraphQLErrorMessage(error)
      const normalizedMessage = message.toLowerCase()

      if (
        normalizedMessage.includes('nome') ||
        normalizedMessage.includes('name') ||
        normalizedMessage.includes('at least 2 character') ||
        normalizedMessage.includes('at most 80 character')
      ) {
        setNameError(message)
        setFeedback(null)
        return
      }

      setFeedback({
        message,
        tone: 'error'
      })
    }
  }

  return (
    <section className="section-stack">
      <section className="surface account-panel account-panel--profile">
        <div className="account-profile account-profile--profile">
          <div className="account-profile__avatar">{initials}</div>
          <div className="account-profile__text">
            <h2 className="account-profile__name">
              {loading ? 'Carregando...' : name || 'Conta teste'}
            </h2>
            <p className="account-profile__email">{email}</p>
          </div>
        </div>

        <div className="account-divider" />

        <form className="account-form" onSubmit={handleSubmit}>
          <Input
            label="Nome completo"
            type={name ? 'Filled' : 'Empty'}
            value={name}
            onValueChange={handleNameChange}
            placeholder="Conta teste"
            leftIcon={<User size={18} aria-hidden="true" />}
            errorMessage={nameError ?? undefined}
          />

          <Input
            label="E-mail"
            type="Disabled"
            value={email}
            helper="O e-mail não pode ser alterado"
            leftIcon={<Mail size={18} aria-hidden="true" />}
            disabled
          />

          {feedback && (
            <p
              className={`feedback ${
                feedback.tone === 'success' ? 'feedback--success' : ''
              }`}
            >
              {feedback.message}
            </p>
          )}

          <LabelButton
            htmlType="submit"
            type={!hasNameChanged || isSaving ? 'Disabled' : 'Default'}
            disabled={!hasNameChanged || isSaving}
            className="account-action-button account-action-button__save"
          >
            {isSaving ? 'Salvando...' : 'Salvar alterações'}
          </LabelButton>

          <LabelButton
            variant="Outline"
            onClick={handleLogout}
            icone={UiIcon.LogOut}
            iconColor={UiColor.Danger}
            className="account-action-button account-action-button--logout"
          >
            Sair da conta
          </LabelButton>
        </form>
      </section>
    </section>
  )
}
