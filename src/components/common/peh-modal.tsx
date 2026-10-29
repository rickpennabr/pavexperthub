'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface PehModalProps {
  open: boolean
  onClose: () => void
  /** Screen-reader name for the dialog. */
  title: string
  /** `sm` is a short dialog. `lg` fits a sectioned account form. */
  size?: 'sm' | 'lg'
  /** Sits above another open modal, such as delete confirmation over edit account. */
  elevated?: boolean
  children: ReactNode
}

let openModalCount = 0
const modalStack: symbol[] = []

/**
 * PavExpert Hub modal. Full viewport on phones, centered card from the `sm` breakpoint up.
 * Same frame idea as the BrazaLink modal: edge-to-edge sheet on mobile, dialog on desktop.
 */
export function PehModal({ open, onClose, title, size = 'sm', elevated = false, children }: PehModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const modalId = useRef(Symbol('peh-modal'))
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return
    openModalCount += 1
    modalStack.push(modalId.current)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()

    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      if (modalStack[modalStack.length - 1] !== modalId.current) return
      onCloseRef.current()
    }

    window.addEventListener('keydown', onKey)
    return () => {
      openModalCount = Math.max(0, openModalCount - 1)
      const index = modalStack.lastIndexOf(modalId.current)
      if (index >= 0) modalStack.splice(index, 1)
      if (openModalCount === 0) document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className={`fixed inset-0 ${elevated ? 'z-[10050]' : 'z-[10000]'}`}>
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/70"
        onClick={() => onCloseRef.current()}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        data-peh-modal=""
        className={`fixed inset-0 flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden rounded-none bg-white text-black outline-none sm:inset-auto sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[90vh] sm:w-full sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:border-2 sm:border-red-500 sm:shadow-2xl ${
          size === 'lg' ? 'sm:max-w-[600px]' : 'sm:max-w-[425px]'
        }`}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}

export function PehCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-2 border-black bg-black text-white hover:border-red-500 hover:bg-red-500"
    >
      <X className="h-4 w-4" strokeWidth={2.5} />
    </button>
  )
}
