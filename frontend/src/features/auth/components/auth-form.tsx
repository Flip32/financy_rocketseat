import { useMutation } from '@apollo/client'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { getGraphQLErrorMessage } from '../../../lib/graphql-error'
import {
  CheckBox,
  Input,
  LabelButton,
  UiIcon,
  UiLink
} from '../../system/components/ui'
import { SIGN_IN_MUTATION, SIGN_UP_MUTATION } from '../graphql/auth-documents'

export type AuthMode = 'signin' | 'signup'

type AuthFormProps = {
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
  onAuthenticated: (token: string, rememberMe: boolean) => void
  onFeedback: (message: string | null) => void
}

type AuthFormErrors = {
  name?: string
  email?: string
  password?: string
}

type SignUpResponse = {
  signUp: {
    token: string
  }
}

type SignInResponse = {
  signIn: {
    token: string
  }
}

function isValidEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email)
}

function validateForm(
  mode: AuthMode,
  values: {
    name: string
    email: string
    password: string
  }
): AuthFormErrors {
  const errors: AuthFormErrors = {}
  const normalizedName = values.name.trim()
  const normalizedEmail = values.email.trim()

  if (mode === 'signup' && normalizedName.length < 2) {
    errors.name = 'Informe seu nome completo.'
  }

  if (!normalizedEmail) {
    errors.email = 'Informe seu e-mail.'
  } else if (!isValidEmail(normalizedEmail)) {
    errors.email = 'Informe um e-mail válido.'
  }

  if (values.password.length < 8) {
    errors.password = 'A senha deve ter no mínimo 8 caracteres.'
  }

  return errors
}

function mapServerErrors(message: string | null): {
  fieldErrors: AuthFormErrors
  feedback: string | null
} {
  if (!message) {
    return {
      fieldErrors: {},
      feedback: 'Algo deu errado. Tente novamente.'
    }
  }

  const normalizedMessage = message.toLowerCase()

  if (
    normalizedMessage.includes('e-mail ou senha inválidos') ||
    normalizedMessage.includes('senha') ||
    normalizedMessage.includes('password') ||
    normalizedMessage.includes('at least 8 character')
  ) {
    return {
      fieldErrors: { password: message },
      feedback: null
    }
  }

  if (
    normalizedMessage.includes('e-mail') ||
    normalizedMessage.includes('email') ||
    normalizedMessage.includes('invalid email')
  ) {
    return {
      fieldErrors: { email: message },
      feedback: null
    }
  }

  if (
    normalizedMessage.includes('nome') ||
    normalizedMessage.includes('name') ||
    normalizedMessage.includes('at least 2 character') ||
    normalizedMessage.includes('at most 80 character')
  ) {
    return {
      fieldErrors: { name: message },
      feedback: null
    }
  }

  return {
    fieldErrors: {},
    feedback: message
  }
}

export function AuthForm({
  mode,
  onModeChange,
  onAuthenticated,
  onFeedback
}: AuthFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [formErrors, setFormErrors] = useState<AuthFormErrors>({})

  useEffect(() => {
    setFormErrors({})
    onFeedback(null)
    setPassword('')
    setShowPassword(false)

    if (mode === 'signin') {
      setName('')
    } else {
      setRememberMe(false)
    }
  }, [mode, onFeedback])

  const [signUp, { loading: signUpLoading }] =
    useMutation<SignUpResponse>(SIGN_UP_MUTATION)

  const [signIn, { loading: signInLoading }] =
    useMutation<SignInResponse>(SIGN_IN_MUTATION)

  const submitting = signUpLoading || signInLoading

  const submitButtonLabel = useMemo(() => {
    if (mode === 'signin') {
      return 'Entrar'
    }

    return 'Cadastrar'
  }, [mode])

  function handleNameChange(value: string) {
    setName(value)
    setFormErrors(current => ({
      ...current,
      name: undefined
    }))
    onFeedback(null)
  }

  function handleEmailChange(value: string) {
    setEmail(value)
    setFormErrors(current => ({
      ...current,
      email: undefined
    }))
    onFeedback(null)
  }

  function handlePasswordChange(value: string) {
    setPassword(value)
    setFormErrors(current => ({
      ...current,
      password: undefined
    }))
    onFeedback(null)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onFeedback(null)

    const clientErrors = validateForm(mode, { name, email, password })

    if (Object.keys(clientErrors).length > 0) {
      setFormErrors(clientErrors)
      return
    }

    setFormErrors({})

    try {
      if (mode === 'signup') {
        const response = await signUp({
          variables: {
            input: {
              name: name.trim(),
              email: email.trim(),
              password
            }
          }
        })

        const token = response.data?.signUp?.token

        if (!token) {
          onFeedback('Não foi possível criar sua conta agora.')
          return
        }

        setPassword('')
        onAuthenticated(token, rememberMe)
        return
      }

      const response = await signIn({
        variables: {
          input: {
            email: email.trim(),
            password
          }
        }
      })

      const token = response.data?.signIn?.token

      if (!token) {
        onFeedback('Não foi possível entrar agora.')
        return
      }

      setPassword('')
      onAuthenticated(token, rememberMe)
    } catch (error) {
      const mappedErrors = mapServerErrors(getGraphQLErrorMessage(error))

      setFormErrors(current => ({
        ...current,
        ...mappedErrors.fieldErrors
      }))
      onFeedback(mappedErrors.feedback)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-page-form">
      {mode === 'signup' && (
        <Input
          label="Nome completo"
          type={name ? 'Filled' : 'Empty'}
          value={name}
          onValueChange={handleNameChange}
          required
          minLength={2}
          placeholder="Seu nome completo"
          leftIcon={<User size={16} aria-hidden="true" />}
          errorMessage={formErrors.name}
        />
      )}

      <Input
        label="E-mail"
        type={email ? 'Filled' : 'Empty'}
        value={email}
        onValueChange={handleEmailChange}
        inputType="email"
        required
        placeholder="mail@exemplo.com"
        leftIcon={<Mail size={16} aria-hidden="true" />}
        errorMessage={formErrors.email}
      />

      <Input
        label="Senha"
        type={password ? 'Filled' : 'Empty'}
        value={password}
        onValueChange={handlePasswordChange}
        inputType={showPassword ? 'text' : 'password'}
        required
        minLength={8}
        placeholder="Digite sua senha"
        leftIcon={<Lock size={16} aria-hidden="true" />}
        rightIcon={
          showPassword ? (
            <EyeOff size={16} aria-hidden="true" />
          ) : (
            <Eye size={16} aria-hidden="true" />
          )
        }
        onRightIconClick={() => setShowPassword(current => !current)}
        rightIconAriaLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
        helper={
          mode === 'signup'
            ? 'A senha deve ter no mínimo 8 caracteres.'
            : undefined
        }
        errorMessage={formErrors.password}
      />

      {mode === 'signin' && (
        <div className="auth-page-form__inline-actions">
          <CheckBox
            checked={rememberMe}
            onCheckedChange={setRememberMe}
            name="remember_me"
            id="remember-me"
          >
            Lembrar-me
          </CheckBox>

          <UiLink>Recuperar senha</UiLink>
        </div>
      )}

      <LabelButton
        htmlType="submit"
        type={submitting ? 'Disabled' : 'Default'}
        disabled={submitting}
        className="auth-page-form__submit"
      >
        {submitting ? 'Enviando...' : submitButtonLabel}
      </LabelButton>

      <div className="auth-page-form__footer">
        <div className="auth-page-form__divider">ou</div>

        {mode === 'signin' ? (
          <>
            <p className="auth-page-form__helper">Ainda não tem uma conta?</p>
            <LabelButton
              variant="Outline"
              type={submitting ? 'Disabled' : 'Default'}
              onClick={() => onModeChange('signup')}
              disabled={submitting}
              icone={UiIcon.UserPlus}
              className="auth-page-form__switch"
            >
              Criar conta
            </LabelButton>
          </>
        ) : (
          <>
            <p className="auth-page-form__helper">Já tem uma conta?</p>
            <LabelButton
              variant="Outline"
              type={submitting ? 'Disabled' : 'Default'}
              onClick={() => onModeChange('signin')}
              disabled={submitting}
              icone={UiIcon.LogIn}
              className="auth-page-form__switch"
            >
              Fazer login
            </LabelButton>
          </>
        )}
      </div>
    </form>
  )
}
