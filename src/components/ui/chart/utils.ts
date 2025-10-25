import { ChartOptions } from 'chart.js'
import type { ChartConfig } from './types'

/**
 * Default color palette for charts
 * Uses design system colors
 */
export const DEFAULT_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--error))',
  'hsl(var(--info))',
  'hsl(var(--accent))',
  'hsl(var(--primary-500))',
  'hsl(var(--primary-700))',
  'hsl(var(--neutral-600))',
  'hsl(var(--neutral-800))',
]

/**
 * Get chart color by index with fallback
 */
export function getChartColor(index: number, customColors?: string[]): string {
  const colors = customColors || DEFAULT_COLORS
  return colors[index % colors.length]
}

/**
 * Get the current theme mode
 */
export function getThemeMode(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/**
 * Get grid color based on theme
 */
export function getGridColor(): string {
  const isDark = getThemeMode() === 'dark'
  return isDark ? 'hsl(var(--border) / 0.2)' : 'hsl(var(--border) / 0.5)'
}

/**
 * Get text color based on theme
 */
export function getTextColor(): string {
  return 'hsl(var(--foreground))'
}

/**
 * Format number with appropriate suffix (K, M, B)
 */
export function formatNumber(value: number): string {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1) + 'B'
  }
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M'
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K'
  }
  return value.toFixed(0)
}

/**
 * Format number as currency
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Format number as percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Default chart options with theme integration
 */
export function getDefaultChartOptions<T extends keyof ChartOptions = 'line'>(
  config?: ChartConfig
): any {
  const textColor = getTextColor()
  const gridColor = getGridColor()

  return {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: textColor,
          font: {
            family: config?.fonts?.family || 'var(--font-sans)',
            size: config?.fonts?.size || 12,
          },
          padding: config?.spacing?.padding || 10,
          usePointStyle: true,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'hsl(var(--popover))',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: gridColor,
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: config?.formatters?.tooltip ? {
          label: config.formatters.tooltip,
        } : undefined,
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: gridColor,
        },
        ticks: {
          color: textColor,
          font: {
            family: config?.fonts?.family || 'var(--font-sans)',
            size: config?.fonts?.size || 11,
          },
        },
      },
      y: {
        grid: {
          display: true,
          color: gridColor,
        },
        ticks: {
          color: textColor,
          font: {
            family: config?.fonts?.family || 'var(--font-sans)',
            size: config?.fonts?.size || 11,
          },
        },
      },
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart',
    },
  }
}

/**
 * Merge custom options with defaults
 */
export function mergeChartOptions<T extends keyof ChartOptions = 'line'>(
  defaultOptions: any,
  customOptions?: any
): any {
  if (!customOptions) return defaultOptions

  return {
    ...defaultOptions,
    ...customOptions,
    plugins: {
      ...defaultOptions.plugins,
      ...customOptions.plugins,
    },
    scales: {
      ...defaultOptions.scales,
      ...customOptions.scales,
    },
  }
}

/**
 * Export chart as image
 */
export function exportChart(
  chartRef: HTMLCanvasElement | null,
  format: 'png' | 'jpg' = 'png',
  filename: string = 'chart'
): void {
  if (!chartRef) return

  const url = chartRef.toDataURL(`image/${format}`)
  const link = document.createElement('a')
  link.download = `${filename}.${format}`
  link.href = url
  link.click()
}

/**
 * Calculate chart dimensions based on container
 */
export function calculateChartDimensions(
  containerRef: HTMLDivElement | null,
  aspectRatio: number = 2
): { width: number; height: number } {
  if (!containerRef) {
    return { width: 400, height: 200 }
  }

  const width = containerRef.offsetWidth
  const height = width / aspectRatio

  return { width, height }
}

/**
 * Validate chart data
 */
export function validateChartData(
  data: any,
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter'
): boolean {
  if (!data) return false

  switch (type) {
    case 'line':
    case 'bar':
    case 'area':
      return (
        data.labels &&
        Array.isArray(data.labels) &&
        data.datasets &&
        Array.isArray(data.datasets) &&
        data.datasets.length > 0
      )
    case 'pie':
      return Array.isArray(data) && data.length > 0
    case 'scatter':
      return (
        data.datasets &&
        Array.isArray(data.datasets) &&
        data.datasets.length > 0
      )
    default:
      return false
  }
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get animation duration based on user preferences
 */
export function getAnimationDuration(defaultDuration: number = 750): number {
  return prefersReducedMotion() ? 0 : defaultDuration
}
