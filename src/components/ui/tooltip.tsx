'use client'

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

interface TooltipProps {
  children: React.ReactElement
  content: string | React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  delayDuration?: number
  disabled?: boolean
}

export function Tooltip({ 
  children, 
  content, 
  side = 'right', 
  delayDuration = 200,
  disabled = false 
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  const [position, setPosition] = React.useState({ top: 0, left: 0 })
  const [mounted, setMounted] = React.useState(false)
  const [positionReady, setPositionReady] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const triggerRef = React.useRef<HTMLElement>(null)

  const calculatePosition = React.useCallback(() => {
    if (!triggerRef.current) return { top: 0, left: 0 }

    const rect = triggerRef.current.getBoundingClientRect()
    const scrollX = window.scrollX || window.pageXOffset
    const scrollY = window.scrollY || window.pageYOffset

    let top = 0
    let left = 0

    switch (side) {
      case 'top':
        top = rect.top + scrollY
        left = rect.left + scrollX + rect.width / 2
        break
      case 'right':
        top = rect.top + scrollY + rect.height / 2
        left = rect.right + scrollX
        break
      case 'bottom':
        top = rect.bottom + scrollY
        left = rect.left + scrollX + rect.width / 2
        break
      case 'left':
        top = rect.top + scrollY + rect.height / 2
        left = rect.left + scrollX
        break
    }

    return { top, left }
  }, [side])

  const showTooltip = React.useCallback(() => {
    if (disabled || !triggerRef.current) return
    
    timeoutRef.current = setTimeout(() => {
      // Calculate position FIRST, then show
      const newPosition = calculatePosition()
      setPosition(newPosition)
      setPositionReady(true)
      // Small delay to ensure position is set before making visible
      requestAnimationFrame(() => {
        setIsVisible(true)
      })
    }, delayDuration)
  }, [delayDuration, disabled, calculatePosition])

  const hideTooltip = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
    setPositionReady(false)
  }, [])

  const handleMouseEnter = () => {
    showTooltip()
  }

  const handleMouseLeave = () => {
    if (!isFocused) {
      hideTooltip()
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    showTooltip()
  }

  const handleBlur = () => {
    setIsFocused(false)
    hideTooltip()
  }

  React.useEffect(() => {
    setMounted(true)
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const child = React.Children.only(children) as React.ReactElement<{
    ref?: React.Ref<HTMLElement>;
    onMouseEnter?: (e: React.MouseEvent) => void;
    onMouseLeave?: (e: React.MouseEvent) => void;
    onFocus?: (e: React.FocusEvent) => void;
    onBlur?: (e: React.FocusEvent) => void;
  }>

  const clonedChild = React.cloneElement(child, {
    ref: (node: HTMLElement | null) => {
      if (node) {
        triggerRef.current = node
      }
      // Preserve any existing ref
      const existingRef = child.props.ref
      if (typeof existingRef === 'function') {
        existingRef(node)
      } else if (existingRef && 'current' in existingRef) {
        (existingRef as React.MutableRefObject<HTMLElement | null>).current = node
      }
    },
    onMouseEnter: (e: React.MouseEvent) => {
      handleMouseEnter()
      if (child.props && typeof child.props.onMouseEnter === 'function') {
        child.props.onMouseEnter(e)
      }
    },
    onMouseLeave: (e: React.MouseEvent) => {
      handleMouseLeave()
      if (child.props && typeof child.props.onMouseLeave === 'function') {
        child.props.onMouseLeave(e)
      }
    },
    onFocus: (e: React.FocusEvent) => {
      handleFocus()
      if (child.props && typeof child.props.onFocus === 'function') {
        child.props.onFocus(e)
      }
    },
    onBlur: (e: React.FocusEvent) => {
      handleBlur()
      if (child.props && typeof child.props.onBlur === 'function') {
        child.props.onBlur(e)
      }
    },
  })

  const getTransformStyle = () => {
    let transform = ''
    switch (side) {
      case 'top':
        transform = 'translate(-50%, -100%) translateY(-8px)'
        break
      case 'right':
        transform = 'translate(0, -50%) translateX(8px)'
        break
      case 'bottom':
        transform = 'translate(-50%, 0) translateY(8px)'
        break
      case 'left':
        transform = 'translate(-100%, -50%) translateX(-8px)'
        break
    }
    return transform
  }

  const tooltipContent = isVisible && mounted && positionReady && (
    <div
      role="tooltip"
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: getTransformStyle(),
        zIndex: 9999,
      }}
      className={cn(
        "px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg",
        "whitespace-nowrap pointer-events-none",
        "animate-fade-in"
      )}
    >
      {content}
      <div
        className={cn(
          "absolute w-2 h-2 bg-gray-900 transform rotate-45",
          side === 'top' && "bottom-[-4px] left-1/2 -translate-x-1/2",
          side === 'right' && "left-[-4px] top-1/2 -translate-y-1/2",
          side === 'bottom' && "top-[-4px] left-1/2 -translate-x-1/2",
          side === 'left' && "right-[-4px] top-1/2 -translate-y-1/2"
        )}
      />
    </div>
  )

  return (
    <>
      {clonedChild}
      {mounted && typeof window !== 'undefined' && !disabled && createPortal(
        tooltipContent,
        document.body
      )}
    </>
  )
}
