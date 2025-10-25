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
import { AreaChartProps } from './types'
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
 * AreaChart component
 * 
 * Displays cumulative data and trends over time using filled areas.
 * Similar to LineChart but with filled regions under the lines.
 * 
 * @example
 * ```tsx
 * <AreaChart
 *   data={{
 *     labels: ['Jan', 'Feb', 'Mar', 'Apr'],
 *     datasets: [{
 *       label: 'Revenue',
 *       data: [100, 150, 200, 180],
 *     }]
 *   }}
 *   title="Revenue Over Time"
 *   stacked={false}
 * />
 * ```
 */
export const AreaChart = React.forwardRef<HTMLDivElement, AreaChartProps>(
  (
    {
      data,
      options,
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
    const chartRef = React.useRef<ChartJS<'line'>>(null)

    // Prepare chart data with colors and fill
    const chartData = React.useMemo(() => {
      return {
        labels: data.labels,
        datasets: data.datasets.map((dataset, index) => {
          const color = dataset.backgroundColor || dataset.borderColor || getChartColor(index)
          const colorStr = Array.isArray(color) ? color[0] : color
          
          return {
            ...dataset,
            fill: true,
            backgroundColor: typeof colorStr === 'string' 
              ? colorStr.replace(')', ' / 0.2)').replace('hsl(', 'hsl(')
              : colorStr,
            borderColor: color,
            borderWidth: dataset.borderWidth || 2,
            tension: dataset.tension !== undefined ? dataset.tension : 0.4,
            pointRadius: dataset.pointRadius || 0,
            pointHoverRadius: dataset.pointHoverRadius || 6,
          }
        }),
      }
    }, [data])

    // Prepare chart options
    const chartOptions = React.useMemo(() => {
      const defaultOptions = getDefaultChartOptions<'line'>()

      const customOptions: Partial<ChartOptions<'line'>> = {
        ...defaultOptions,
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          ...defaultOptions.plugins,
          legend: {
            ...defaultOptions.plugins?.legend,
            display: showLegend,
          },
          tooltip: {
            ...defaultOptions.plugins?.tooltip,
            mode: 'index',
            intersect: false,
          },
        },
        scales: {
          x: {
            ...defaultOptions.scales?.x,
            stacked,
            grid: {
              ...defaultOptions.scales?.x?.grid,
              display: showGrid,
            },
          },
          y: {
            ...defaultOptions.scales?.y,
            stacked,
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
    }, [stacked, showLegend, showGrid, animated, options])

    // Export function
    const handleExport = React.useCallback(() => {
      if (chartRef.current) {
        exportChart(chartRef.current.canvas, 'png', 'area-chart')
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
        ariaLabel={ariaLabel || 'Area chart'}
        height={height}
        {...wrapperProps}
      >
        {!isEmpty && (
          <Line
            ref={chartRef}
            data={chartData}
            options={chartOptions}
            aria-label={ariaLabel || 'Area chart visualization'}
          />
        )}
      </ChartWrapper>
    )
  }
)

AreaChart.displayName = 'AreaChart'
