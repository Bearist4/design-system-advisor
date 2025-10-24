'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { useFocusTrap, useReducedMotion, announcementManager, useId } from "@/lib/accessibility"

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, title, description, children, className }, ref) => {
    const focusTrapRef = useFocusTrap(isOpen)
    const prefersReducedMotion = useReducedMotion()
    const titleId = useId('modal-title')
    const descriptionId = useId('modal-description')

    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }

      if (isOpen) {
        document.addEventListener('keydown', handleEscape)
        document.body.style.overflow = 'hidden'
        // Announce modal opening to screen readers
        announcementManager.announce(
          title ? `Modal opened: ${title}` : 'Modal opened',
          'polite'
        )
      }

      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = 'unset'
      }
    }, [isOpen, onClose, title])

    if (!isOpen) return null

    const animationClass = prefersReducedMotion
      ? ''
      : 'animate-in fade-in-0 zoom-in-95'

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
      >
        <div
          className={cn(
            "fixed inset-0 bg-black/50",
            !prefersReducedMotion && "animate-in fade-in-0"
          )}
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          ref={(node) => {
            // Merge refs
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
            if (typeof focusTrapRef === 'function') {
              focusTrapRef(node as any)
            } else if (focusTrapRef) {
              focusTrapRef.current = node as any
            }
          }}
          className={cn(
            "relative z-50 w-full max-w-lg max-h-[90vh] overflow-auto rounded-lg border bg-background p-6 shadow-lg",
            animationClass,
            className
          )}
        >
          {title && (
            <div className="flex items-center justify-between mb-4">
              <h2 
                id={titleId} 
                className="text-lg font-semibold"
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
          {description && (
            <p id={descriptionId} className="sr-only">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    )
  }
)
Modal.displayName = "Modal"

export { Modal }
