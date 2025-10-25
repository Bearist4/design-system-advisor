'use client'

import * as React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { ChartWrapper } from './ChartWrapper'
import { BarChartProps } from './types'
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
  BarElement,
  Title,
  Tooltip,
  Legend
)

/**
 * BarChart component
 * 
 * Displays categorical data, comparisons, and rankings using bars.
 * Supports vertical/horizontal orientation, stacking, and multiple datasets.
 * 
 * @example
 * ```tsx
 * <BarChart
 *   data={{
 *     labels: ['Q1', 'Q2', 'Q3', 'Q4'],
 *     datasets: [{
 *       label: 'Revenue',
 *       data: [120, 150, 180, 200],
 *     }]
 *   }}
 *   title="Quarterly Revenue"
 *   orientation="vertical"
 *   stacked={false}
 * />
 * ```
 */
export const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      data,
      options,
      orientation = 'vertical',
      stacked = false,
      showLegend = true,
      showGrid = true,
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
    const chartRef = React.useRef<ChartJS<'bar'>>(null)
    const indexAxis = orientation === 'horizontal' ? 'y' : 'x'

    // Prepare chart data with colors
    const chartData = React.useMemo(() => {
      return {
        labels: data.labels,
        datasets: data.datasets.map((dataset, index) => ({
          ...dataset,
          backgroundColor: dataset.backgroundColor || getChartColor(index),
          borderColor: dataset.borderColor || getChartColor(index),
          borderWidth: dataset.borderWidth || 0,
          borderRadius: 4,
        })),
      }
    }, [data])

    // Prepare chart options
    const chartOptions = React.useMemo(() => {
      const defaultOptions = getDefaultChartOptions<'bar'>()

      const customOptions: Partial<ChartOptions<'bar'>> = {
        ...defaultOptions,
        indexAxis,
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
            stacked,
            grid: {
              ...defaultOptions.scales?.x?.grid,
              display: indexAxis === 'x' ? showGrid : false,
            },
          },
          y: {
            ...defaultOptions.scales?.y,
            stacked,
            grid: {
              ...defaultOptions.scales?.y?.grid,
              display: indexAxis === 'y' ? false : showGrid,
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
    }, [indexAxis, stacked, showLegend, showGrid, animated, options])

    // Export function
    const handleExport = React.useCallback(() => {
      if (chartRef.current) {
        exportChart(chartRef.current.canvas, 'png', 'bar-chart')
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
        ariaLabel={ariaLabel || 'Bar chart'}
        height={height}
        {...wrapperProps}
      >
        {!isEmpty && (
          <Bar
            ref={chartRef}
            data={chartData}
            options={chartOptions}
            aria-label={ariaLabel || 'Bar chart visualization'}
          />
        )}
      </ChartWrapper>
    )
  }
)

BarChart.displayName = 'BarChart'
