/**
 * Charts Component Library
 * 
 * A comprehensive chart component library for data visualization.
 * Supports various chart types with consistent styling and interactions.
 */

// Chart Components
export { LineChart } from './LineChart'
export { BarChart } from './BarChart'
export { PieChart, DonutChart } from './PieChart'
export { AreaChart } from './AreaChart'
export { ScatterChart } from './ScatterChart'
export { GaugeChart } from './GaugeChart'
export { HeatmapChart } from './HeatmapChart'

// Base Components
export { ChartWrapper } from './ChartWrapper'

// Types
export type {
  BaseChartProps,
  DataPoint,
  ChartDataset,
  LineChartProps,
  BarChartProps,
  PieChartProps,
  AreaChartProps,
  ScatterChartProps,
  GaugeChartProps,
  HeatmapProps,
  ExportFormat,
  ExportOptions,
  ValueFormatter,
  LabelFormatter,
  TooltipFormatter,
  ChartConfig,
} from './types'

// Utilities
export {
  DEFAULT_COLORS,
  getChartColor,
  getThemeMode,
  getGridColor,
  getTextColor,
  formatNumber,
  formatCurrency,
  formatPercentage,
  getDefaultChartOptions,
  mergeChartOptions,
  exportChart,
  calculateChartDimensions,
  validateChartData,
  prefersReducedMotion,
  getAnimationDuration,
} from './utils'
