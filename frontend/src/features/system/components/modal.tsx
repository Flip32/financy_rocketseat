import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

import { IconButton, UiIcon } from './ui'

import './modal.css'

type ModalProps = {
  open: boolean
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
  className?: string
}

export function Modal({
  open,
  title,
  subtitle,
  onClose,
  children,
  className
}: ModalProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscapeKey)

    return () => {
      window.removeEventListener('keydown', handleEscapeKey)
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  return createPortal(
    <div className="modal-backdrop">
      <dialog
        open
        className={`modal${className ? ` ${className}` : ''}`}
        aria-label={title}
      >
        <header className="modal__header">
          <div className="modal__heading">
            <h3 className="modal__title">{title}</h3>
            {subtitle ? <p className="modal__subtitle">{subtitle}</p> : null}
          </div>
          <IconButton
            icone={UiIcon.X}
            aria-label="Fechar modal"
            onClick={onClose}
          />
        </header>

        <div className="modal__body">{children}</div>
      </dialog>
    </div>,
    document.body
  )
}
