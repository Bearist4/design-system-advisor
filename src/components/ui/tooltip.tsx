'use client'

import * as React from "react"
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
  align = 'center',
  delayDuration = 200,
  disabled = false 
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const showTooltip = React.useCallback(() => {
    if (disabled) return
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delayDuration)
  }, [delayDuration, disabled])

  const hideTooltip = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
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
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const child = React.Children.only(children)

  const clonedChild = React.cloneElement(child, {
    onMouseEnter: (e: React.MouseEvent) => {
      handleMouseEnter()
      child.props.onMouseEnter?.(e)
    },
    onMouseLeave: (e: React.MouseEvent) => {
      handleMouseLeave()
      child.props.onMouseLeave?.(e)
    },
    onFocus: (e: React.FocusEvent) => {
      handleFocus()
      child.props.onFocus?.(e)
    },
    onBlur: (e: React.FocusEvent) => {
      handleBlur()
      child.props.onBlur?.(e)
    },
  })

  const sideClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  }

  const alignClasses = {
    start: side === 'top' || side === 'bottom' ? 'left-0 translate-x-0' : 'top-0 translate-y-0',
    center: '',
    end: side === 'top' || side === 'bottom' ? 'left-auto right-0 translate-x-0' : 'top-auto bottom-0 translate-y-0',
  }

  return (
    <div className="relative inline-block">
      {clonedChild}
      {isVisible && !disabled && (
        <div
          role="tooltip"
          className={cn(
            "absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg",
            "whitespace-nowrap pointer-events-none",
            "animate-in fade-in-0 zoom-in-95",
            sideClasses[side],
            align !== 'center' && alignClasses[align]
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
      )}
    </div>
  )
}
