"use client"

/**
 * Accessibility Utilities
 * Comprehensive utilities for managing accessibility features across components
 */

import { useEffect, useRef, useCallback, useState } from 'react'

/**
 * Focus Trap Hook
 * Traps focus within a container element (e.g., for modals)
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement

    // Get all focusable elements
    const getFocusableElements = () => {
      if (!containerRef.current) return []
      const selectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(',')
      return Array.from(containerRef.current.querySelectorAll(selectors)) as HTMLElement[]
    }

    const focusableElements = getFocusableElements()
    if (focusableElements.length === 0) return

    // Focus the first element
    focusableElements[0]?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusableElements = getFocusableElements()
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Restore focus to the previously focused element
      previousActiveElement.current?.focus()
    }
  }, [isActive])

  return containerRef
}

/**
 * Announce to Screen Readers
 * Creates a live region announcement for screen readers
 */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const liveRegion = document.getElementById('a11y-announcer')
  if (liveRegion) {
    liveRegion.setAttribute('aria-live', priority)
    liveRegion.textContent = message
    // Clear after announcement to avoid repetition
    setTimeout(() => {
      liveRegion.textContent = ''
    }, 1000)
  }
}

/**
 * Screen Reader Announcer Component
 * Should be included once at the root of the application
 */
export function ScreenReaderAnnouncer() {
  return (
    <div
      id="a11y-announcer"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  )
}

/**
 * Motion Preference Hook
 * Detects user's motion preferences and respects prefers-reduced-motion
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [])

  return prefersReducedMotion
}

/**
 * Get transition class based on motion preferences
 */
export function getTransitionClass(
  normalTransition: string,
  prefersReducedMotion?: boolean
): string {
  if (prefersReducedMotion) {
    return 'transition-none'
  }
  return normalTransition
}

/**
 * Roving Tabindex Hook
 * Manages keyboard navigation in a list of items (e.g., menu, toolbar)
 */
export function useRovingTabIndex<T extends HTMLElement>() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsRef = useRef<T[]>([])

  const handleKeyDown = useCallback((e: KeyboardEvent, index: number) => {
    const items = itemsRef.current
    let nextIndex = index

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault()
        nextIndex = (index + 1) % items.length
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault()
        nextIndex = (index - 1 + items.length) % items.length
        break
      case 'Home':
        e.preventDefault()
        nextIndex = 0
        break
      case 'End':
        e.preventDefault()
        nextIndex = items.length - 1
        break
      default:
        return
    }

    setCurrentIndex(nextIndex)
    items[nextIndex]?.focus()
  }, [])

  const registerItem = useCallback((element: T | null, index: number) => {
    if (element) {
      itemsRef.current[index] = element
    }
  }, [])

  const getItemProps = useCallback(
    (index: number) => ({
      tabIndex: index === currentIndex ? 0 : -1,
      onKeyDown: (e: KeyboardEvent) => handleKeyDown(e, index),
      ref: (el: T | null) => registerItem(el, index),
    }),
    [currentIndex, handleKeyDown, registerItem]
  )

  return { getItemProps, currentIndex, setCurrentIndex }
}

/**
 * Generate unique IDs for accessibility relationships (aria-labelledby, aria-describedby)
 */
let idCounter = 0
export function useId(prefix = 'a11y') {
  const [id] = useState(() => `${prefix}-${++idCounter}`)
  return id
}

/**
 * Skip to Content Link Component
 * Provides a way for keyboard users to skip navigation
 */
export function SkipToContent({ targetId = 'main-content' }: { targetId?: string }) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const target = document.getElementById(targetId)
    if (target) {
      target.focus()
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
    >
      Skip to content
    </a>
  )
}

/**
 * Visually Hidden Component
 * For screen reader only content
 */
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>
}

/**
 * Focus Visible Class Names
 * Consistent focus styling across components
 */
export const FOCUS_VISIBLE_CLASSES =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

/**
 * Keyboard Navigation Helpers
 */
export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
} as const

export function isActivationKey(key: string): boolean {
  return key === KEYBOARD_KEYS.ENTER || key === KEYBOARD_KEYS.SPACE
}

/**
 * ARIA Announcements Manager
 * Manages multiple announcements without conflicts
 */
class AriaAnnouncementManager {
  private queue: Array<{ message: string; priority: 'polite' | 'assertive' }> = []
  private isProcessing = false

  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    this.queue.push({ message, priority })
    if (!this.isProcessing) {
      this.processQueue()
    }
  }

  private processQueue() {
    if (this.queue.length === 0) {
      this.isProcessing = false
      return
    }

    this.isProcessing = true
    const { message, priority } = this.queue.shift()!
    announce(message, priority)

    // Wait before processing next announcement
    setTimeout(() => {
      this.processQueue()
    }, 1500)
  }
}

export const announcementManager = new AriaAnnouncementManager()
