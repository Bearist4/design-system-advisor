'use client'

import * as React from 'react'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'
import { Scatter } from 'react-chartjs-2'
import { ChartWrapper } from './ChartWrapper'
import { ScatterChartProps } from './types'
import {
  getDefaultChartOptions,
  mergeChartOptions,
  getChartColor,
  exportChart,
  getAnimationDuration,
} from './utils'

// Register Chart.js components
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend)

/**
 * ScatterChart component
 * 
 * Displays correlation analysis and data distribution using scattered points.
 * Useful for visualizing relationships between two variables.
 * 
 * @example
 * ```tsx
 * <ScatterChart
 *   data={{
 *     datasets: [{
 *       label: 'Dataset 1',
 *       data: [
 *         { x: 10, y: 20 },
 *         { x: 15, y: 25 },
 *         { x: 20, y: 30 },
 *       ],
 *     }]
 *   }}
 *   title="Correlation Analysis"
 * />
 * ```
 */
export const ScatterChart = React.forwardRef<HTMLDivElement, ScatterChartProps>(
  (
    {
      data,
      options,
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
    const chartRef = React.useRef<ChartJS<'scatter'>>(null)

    // Prepare chart data with colors
    const chartData = React.useMemo(() => {
      return {
        datasets: data.datasets.map((dataset, index) => ({
          ...dataset,
          backgroundColor: dataset.backgroundColor || getChartColor(index),
          borderColor: dataset.borderColor || getChartColor(index),
          pointRadius: dataset.pointRadius || 5,
          pointHoverRadius: 8,
        })),
      }
    }, [data])

    // Prepare chart options
    const chartOptions = React.useMemo(() => {
      const defaultOptions = getDefaultChartOptions<'scatter'>()

      const customOptions: Partial<ChartOptions<'scatter'>> = {
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
    }, [showLegend, showGrid, animated, options])

    // Export function
    const handleExport = React.useCallback(() => {
      if (chartRef.current) {
        exportChart(chartRef.current.canvas, 'png', 'scatter-chart')
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
        ariaLabel={ariaLabel || 'Scatter chart'}
        height={height}
        {...wrapperProps}
      >
        {!isEmpty && (
          <Scatter
            ref={chartRef}
            data={chartData}
            options={chartOptions}
            aria-label={ariaLabel || 'Scatter chart visualization'}
          />
        )}
      </ChartWrapper>
    )
  }
)

ScatterChart.displayName = 'ScatterChart'
