import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type LinkType = 'Default' | 'Hover'

type BaseLinkProps = {
  type?: LinkType
  iconLeft?: ReactNode
  iconRight?: ReactNode
  children: ReactNode
  className?: string
}

type RouterLinkProps = BaseLinkProps & {
  to: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

type ButtonLinkProps = BaseLinkProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
    htmlType?: 'button' | 'submit' | 'reset'
    to?: never
  }

type UiLinkProps = RouterLinkProps | ButtonLinkProps

function getClassName(type: LinkType) {
  if (type === 'Hover') {
    return 'inline-link inline-link--preview-hover'
  }

  return 'inline-link'
}

export function UiLink(props: UiLinkProps) {
  const className = [getClassName(props.type ?? 'Default'), props.className]
    .filter(Boolean)
    .join(' ')

  const routerProps = props as RouterLinkProps

  if (routerProps.to) {
    const { to, iconLeft, iconRight, children, onClick } = routerProps

    return (
      <Link to={to} className={className} onClick={onClick}>
        {iconLeft ? <span aria-hidden="true">{iconLeft}</span> : null}
        {children}
        {iconRight ? <span aria-hidden="true">{iconRight}</span> : null}
      </Link>
    )
  }

  const {
    iconLeft,
    iconRight,
    children,
    type: _visualType,
    htmlType = 'button',
    ...rest
  } = props as ButtonLinkProps

  return (
    <button type={htmlType} className={className} {...rest}>
      {iconLeft ? <span aria-hidden="true">{iconLeft}</span> : null}
      {children}
      {iconRight ? <span aria-hidden="true">{iconRight}</span> : null}
    </button>
  )
}
