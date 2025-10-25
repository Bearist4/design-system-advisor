import type { ChartOptions as ChartJSOptions, ChartData, TooltipItem } from 'chart.js'

/**
 * Base props shared across all chart components
 */
export interface BaseChartProps {
  /** Unique identifier for the chart */
  id?: string
  /** Additional CSS classes */
  className?: string
  /** Chart height */
  height?: number | string
  /** Chart width */
  width?: number | string
  /** Loading state */
  isLoading?: boolean
  /** Error state */
  error?: string | Error
  /** Empty state message */
  emptyMessage?: string
  /** Accessibility label */
  ariaLabel?: string
  /** Enable/disable animations */
  animated?: boolean
  /** Enable/disable responsiveness */
  responsive?: boolean
  /** Maintain aspect ratio */
  maintainAspectRatio?: boolean
}

/**
 * Data point structure for various chart types
 */
export interface DataPoint {
  label: string
  value: number
  color?: string
  meta?: Record<string, unknown>
}

/**
 * Dataset configuration for line/bar/area charts
 */
export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
  fill?: boolean
  tension?: number
  pointRadius?: number
  pointHoverRadius?: number
}

/**
 * Line Chart specific props
 */
export interface LineChartProps extends BaseChartProps {
  data: {
    labels: string[]
    datasets: ChartDataset[]
  }
  options?: Partial<ChartJSOptions<'line'>>
  showLegend?: boolean
  showGrid?: boolean
  enableZoom?: boolean
}

/**
 * Bar Chart specific props
 */
export interface BarChartProps extends BaseChartProps {
  data: {
    labels: string[]
    datasets: ChartDataset[]
  }
  options?: Partial<ChartJSOptions<'bar'>>
  orientation?: 'vertical' | 'horizontal'
  stacked?: boolean
  showLegend?: boolean
  showGrid?: boolean
}

/**
 * Pie/Donut Chart specific props
 */
export interface PieChartProps extends BaseChartProps {
  data: DataPoint[]
  options?: Partial<ChartJSOptions<'pie'>>
  showLegend?: boolean
  showPercentage?: boolean
  cutout?: string | number // For donut charts
}

/**
 * Area Chart specific props
 */
export interface AreaChartProps extends BaseChartProps {
  data: {
    labels: string[]
    datasets: ChartDataset[]
  }
  options?: Partial<ChartJSOptions<'line'>>
  stacked?: boolean
  showLegend?: boolean
  showGrid?: boolean
}

/**
 * Scatter Plot specific props
 */
export interface ScatterChartProps extends BaseChartProps {
  data: {
    datasets: Array<{
      label: string
      data: Array<{ x: number; y: number }>
      backgroundColor?: string
      borderColor?: string
      pointRadius?: number
    }>
  }
  options?: Partial<ChartJSOptions<'scatter'>>
  showLegend?: boolean
  showGrid?: boolean
}

/**
 * Gauge Chart specific props
 */
export interface GaugeChartProps extends BaseChartProps {
  value: number
  min?: number
  max?: number
  unit?: string
  segments?: Array<{
    threshold: number
    color: string
    label?: string
  }>
  showValue?: boolean
  showLabel?: boolean
}

/**
 * Heatmap specific props
 */
export interface HeatmapProps extends BaseChartProps {
  data: Array<{
    x: string | number
    y: string | number
    value: number
  }>
  xLabels?: string[]
  yLabels?: string[]
  colorScale?: string[]
  showValues?: boolean
  showLegend?: boolean
}

/**
 * Chart export formats
 */
export type ExportFormat = 'png' | 'jpg' | 'svg' | 'pdf'

/**
 * Export options
 */
export interface ExportOptions {
  format: ExportFormat
  filename?: string
  quality?: number // 0-1 for jpg
}

/**
 * Formatter function types
 */
export type ValueFormatter = (value: number) => string
export type LabelFormatter = (label: string, index: number) => string
export type TooltipFormatter = (tooltipItem: TooltipItem<any>) => string

/**
 * Common chart configuration
 */
export interface ChartConfig {
  colors?: string[]
  fonts?: {
    family?: string
    size?: number
    weight?: string | number
  }
  spacing?: {
    padding?: number
    margin?: number
  }
  formatters?: {
    value?: ValueFormatter
    label?: LabelFormatter
    tooltip?: TooltipFormatter
  }
}

export type { ChartData, ChartJSOptions, TooltipItem }
