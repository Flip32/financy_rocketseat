import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'

const AUTH_STORAGE_KEY = 'financy-auth'

const getLocalStorage = () =>
  typeof window === 'undefined' ? undefined : window.localStorage
const getSessionStorage = () =>
  typeof window === 'undefined' ? undefined : window.sessionStorage

let activeStorage: Storage | undefined = getSessionStorage()

const rememberStorage: Storage = {
  get length() {
    const target = activeStorage ?? getSessionStorage()
    return target?.length ?? 0
  },
  clear: () => {
    getLocalStorage()?.removeItem(AUTH_STORAGE_KEY)
    getSessionStorage()?.removeItem(AUTH_STORAGE_KEY)
  },
  key: index => {
    const target = activeStorage ?? getSessionStorage()
    return target?.key(index) ?? null
  },
  getItem: name => {
    const localValue = getLocalStorage()?.getItem(name)
    if (localValue) {
      activeStorage = getLocalStorage()
      return localValue
    }

    const sessionValue = getSessionStorage()?.getItem(name)
    if (sessionValue) {
      activeStorage = getSessionStorage()
      return sessionValue
    }

    return null
  },
  setItem: (name, value) => {
    const target = activeStorage ?? getSessionStorage()
    target?.setItem(name, value)
  },
  removeItem: name => {
    getLocalStorage()?.removeItem(name)
    getSessionStorage()?.removeItem(name)
  }
}

const authStorage = createJSONStorage(() => rememberStorage)

function setAuthStorage(remember: boolean) {
  activeStorage = remember ? getLocalStorage() : getSessionStorage()

  if (remember) {
    getSessionStorage()?.removeItem(AUTH_STORAGE_KEY)
    return
  }

  getLocalStorage()?.removeItem(AUTH_STORAGE_KEY)
}

type AuthState = {
  token: string | null
  rememberMe: boolean
  setToken: (token: string | null, remember?: boolean) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      token: null,
      rememberMe: false,
      setToken: (token, remember = false) => {
        setAuthStorage(remember)
        set({ token, rememberMe: remember })
      },
      clear: () => {
        set({ token: null, rememberMe: false })
        authStorage?.removeItem(AUTH_STORAGE_KEY)
      }
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: authStorage
    }
  )
)
