'use client'

import * as React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { ChartWrapper } from './ChartWrapper'
import { LineChartProps } from './types'
import {
  getDefaultChartOptions,
  mergeChartOptions,
  getChartColor,
  exportChart,
  getAnimationDuration,
} from './utils'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

/**
 * LineChart component
 * 
 * Displays time series data, trends, and comparisons using a line chart.
 * Supports multiple datasets, animations, and responsive design.
 * 
 * @example
 * ```tsx
 * <LineChart
 *   data={{
 *     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
 *     datasets: [{
 *       label: 'Sales',
 *       data: [65, 59, 80, 81, 56],
 *     }]
 *   }}
 *   title="Monthly Sales"
 *   showLegend
 *   showGrid
 * />
 * ```
 */
export const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(
  (
    {
      data,
      options,
      showLegend = true,
      showGrid = true,
      enableZoom = false,
      animated = true,
      isLoading,
      error,
      emptyMessage,
      height = 300,
      ariaLabel,
      className,
      ...wrapperProps
    },
    ref
  ) => {
    const chartRef = React.useRef<ChartJS<'line'>>(null)

    // Prepare chart data with colors
    const chartData = React.useMemo(() => {
      return {
        labels: data.labels,
        datasets: data.datasets.map((dataset, index) => ({
          ...dataset,
          backgroundColor: dataset.backgroundColor || getChartColor(index),
          borderColor: dataset.borderColor || getChartColor(index),
          borderWidth: dataset.borderWidth || 2,
          tension: dataset.tension !== undefined ? dataset.tension : 0.4,
          pointRadius: dataset.pointRadius || 3,
          pointHoverRadius: dataset.pointHoverRadius || 6,
          fill: dataset.fill || false,
        })),
      }
    }, [data])

    // Prepare chart options
    const chartOptions = React.useMemo(() => {
      const defaultOptions = getDefaultChartOptions<'line'>()

      const customOptions: Partial<ChartOptions<'line'>> = {
        ...defaultOptions,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          ...defaultOptions.plugins,
          legend: {
            ...defaultOptions.plugins?.legend,
            display: showLegend,
          },
        },
        scales: {
          x: {
            ...defaultOptions.scales?.x,
            grid: {
              ...defaultOptions.scales?.x?.grid,
              display: showGrid,
            },
          },
          y: {
            ...defaultOptions.scales?.y,
            grid: {
              ...defaultOptions.scales?.y?.grid,
              display: showGrid,
            },
            beginAtZero: true,
          },
        },
        animation: animated
          ? {
              duration: getAnimationDuration(),
              easing: 'easeInOutQuart',
            }
          : false,
      }

      return mergeChartOptions(customOptions, options)
    }, [showLegend, showGrid, enableZoom, animated, options])

    // Export function
    const handleExport = React.useCallback(() => {
      if (chartRef.current) {
        exportChart(chartRef.current.canvas, 'png', 'line-chart')
      }
    }, [])

    // Check if data is empty
    const isEmpty = !data.datasets || data.datasets.length === 0 || 
                   data.datasets.every(ds => !ds.data || ds.data.length === 0)

    return (
      <ChartWrapper
        ref={ref}
        className={className}
        isLoading={isLoading}
        error={error}
        emptyMessage={isEmpty ? (emptyMessage || 'No data available') : undefined}
        exportable
        onExport={handleExport}
        ariaLabel={ariaLabel || 'Line chart'}
        height={height}
        {...wrapperProps}
      >
        {!isEmpty && (
          <Line
            ref={chartRef}
            data={chartData}
            options={chartOptions}
            aria-label={ariaLabel || 'Line chart visualization'}
          />
        )}
      </ChartWrapper>
    )
  }
)

LineChart.displayName = 'LineChart'
