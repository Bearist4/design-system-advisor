'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { BaseChartProps } from './types'
import { Skeleton } from '../skeleton'
import { EmptyState } from '../empty-state'
import { AlertCircle, BarChart3, Download } from 'lucide-react'
import { Button } from '../button'

export interface ChartWrapperProps extends BaseChartProps {
  children: React.ReactNode
  title?: string
  description?: string
  exportable?: boolean
  onExport?: () => void
}

/**
 * ChartWrapper component
 * 
 * Provides consistent layout, loading, error, and empty states for all charts
 */
export const ChartWrapper = React.forwardRef<HTMLDivElement, ChartWrapperProps>(
  (
    {
      children,
      className,
      title,
      description,
      isLoading = false,
      error,
      emptyMessage,
      exportable = false,
      onExport,
      ariaLabel,
      height,
      width,
      ...props
    },
    ref
  ) => {
    const chartId = React.useId()
    const hasData = React.Children.count(children) > 0

    // Loading state
    if (isLoading) {
      return (
        <div
          ref={ref}
          className={cn('rounded-lg border bg-card p-4 sm:p-6', className)}
          role="status"
          aria-busy="true"
          aria-label="Loading chart"
          {...props}
        >
          {title && (
            <div className="mb-4">
              <Skeleton className="h-6 w-48 mb-2" />
              {description && <Skeleton className="h-4 w-full max-w-md" />}
            </div>
          )}
          <Skeleton 
            className="w-full" 
            style={{ 
              height: typeof height === 'number' ? `${height}px` : height || 300 
            }} 
          />
        </div>
      )
    }

    // Error state
    if (error) {
      const errorMessage = typeof error === 'string' ? error : error.message

      return (
        <div
          ref={ref}
          className={cn('rounded-lg border bg-card p-4 sm:p-6', className)}
          role="alert"
          aria-live="polite"
          {...props}
        >
          {title && (
            <div className="mb-4">
              <h3 className="text-lg sm:text-xl font-semibold">{title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>
          )}
          <EmptyState
            icon={<AlertCircle className="h-12 w-12 text-error" />}
            title="Error loading chart"
            description={errorMessage}
          />
        </div>
      )
    }

    // Empty state (no data)
    if (!hasData || emptyMessage) {
      return (
        <div
          ref={ref}
          className={cn('rounded-lg border bg-card p-4 sm:p-6', className)}
          role="status"
          aria-label="No data available"
          {...props}
        >
          {title && (
            <div className="mb-4">
              <h3 className="text-lg sm:text-xl font-semibold">{title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>
          )}
          <EmptyState
            icon={<BarChart3 className="h-12 w-12" />}
            title="No data available"
            description={emptyMessage || 'There is no data to display for this chart.'}
          />
        </div>
      )
    }

    // Success state with data
    return (
      <div
        ref={ref}
        className={cn('rounded-lg border bg-card p-4 sm:p-6', className)}
        role="img"
        aria-label={ariaLabel || title || 'Chart'}
        {...props}
      >
        {(title || exportable) && (
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {title && (
                <h3 id={chartId} className="text-lg sm:text-xl font-semibold truncate">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {description}
                </p>
              )}
            </div>
            {exportable && onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                aria-label="Export chart"
                className="shrink-0"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        <div
          className="relative w-full"
          style={{
            height: typeof height === 'number' ? `${height}px` : height || 'auto',
            width: typeof width === 'number' ? `${width}px` : width || '100%',
          }}
        >
          {children}
        </div>
      </div>
    )
  }
)

ChartWrapper.displayName = 'ChartWrapper'
