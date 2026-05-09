import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'

import type { AuthUser } from '../../auth/types/user'
import {
  getCategoryInitials,
  getCategoryToneClass
} from '../../categories/lib/category-visuals'
import { Logo, LogoIcon } from './ui'

type AppLayoutProps = {
  user: AuthUser | null
  loadingUser: boolean
  children: ReactNode
}

function resolveNavClassName(active: boolean) {
  if (active) {
    return 'app-nav__link app-nav__link--active'
  }

  return 'app-nav__link'
}

export function AppLayout({ user, loadingUser, children }: AppLayoutProps) {
  const avatarLabel = loadingUser
    ? '...'
    : user
      ? getCategoryInitials(user.name)
      : 'CT'

  return (
    <main className="app-shell">
      <section className="app-frame">
        <header className="app-header">
          <div className="app-brand">
            <Logo className="app-brand__full" />
            <LogoIcon className="app-brand__icon" />
          </div>

          <nav className="app-nav" aria-label="Navegação principal">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => resolveNavClassName(isActive)}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/transactions"
              className={({ isActive }) => resolveNavClassName(isActive)}
            >
              Transações
            </NavLink>
            <NavLink
              to="/categories"
              className={({ isActive }) => resolveNavClassName(isActive)}
            >
              Categorias
            </NavLink>
          </nav>

          <Link
            to="/account"
            className={`avatar-badge ${getCategoryToneClass('gray')}`}
            aria-label="Abrir conta"
          >
            {avatarLabel}
          </Link>
        </header>

        <div className="app-content">{children}</div>
      </section>
    </main>
  )
}
