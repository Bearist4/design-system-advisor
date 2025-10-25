'use client'

import * as React from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'
import { Pie, Doughnut } from 'react-chartjs-2'
import { ChartWrapper } from './ChartWrapper'
import { PieChartProps } from './types'
import {
  getDefaultChartOptions,
  mergeChartOptions,
  getChartColor,
  exportChart,
  getAnimationDuration,
  formatPercentage,
} from './utils'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

/**
 * PieChart component
 * 
 * Displays proportional data and percentages using a circular chart.
 * Can be rendered as a pie chart or donut chart (with cutout).
 * 
 * @example
 * ```tsx
 * <PieChart
 *   data={[
 *     { label: 'Product A', value: 300 },
 *     { label: 'Product B', value: 500 },
 *     { label: 'Product C', value: 200 },
 *   ]}
 *   title="Sales by Product"
 *   showLegend
 *   showPercentage
 * />
 * ```
 */
export const PieChart = React.forwardRef<HTMLDivElement, PieChartProps>(
  (
    {
      data,
      options,
      showLegend = true,
      showPercentage = false,
      cutout,
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
    const chartRef = React.useRef<any>(null)
    const isDonut = cutout !== undefined

    // Calculate total for percentages
    const total = React.useMemo(
      () => data.reduce((sum, item) => sum + item.value, 0),
      [data]
    )

    // Prepare chart data
    const chartData = React.useMemo(() => {
      return {
        labels: data.map(item => item.label),
        datasets: [
          {
            data: data.map(item => item.value),
            backgroundColor: data.map(
              (item, index) => item.color || getChartColor(index)
            ),
            borderWidth: 2,
            borderColor: 'hsl(var(--background))',
            hoverBorderWidth: 3,
            hoverBorderColor: 'hsl(var(--foreground))',
          },
        ],
      }
    }, [data])

    // Prepare chart options
    const chartOptions = React.useMemo(() => {
      const defaultOptions = getDefaultChartOptions<'pie'>()

      const customOptions: Partial<ChartOptions<'pie'>> = {
        ...defaultOptions,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          ...defaultOptions.plugins,
          legend: {
            ...defaultOptions.plugins?.legend,
            display: showLegend,
            position: 'right',
          },
          tooltip: {
            ...defaultOptions.plugins?.tooltip,
            callbacks: {
              label: (context) => {
                const label = context.label || ''
                const value = context.parsed || 0
                const percentage = total > 0 ? (value / total) * 100 : 0
                
                if (showPercentage) {
                  return `${label}: ${formatPercentage(percentage)} (${value.toLocaleString()})`
                }
                return `${label}: ${value.toLocaleString()}`
              },
            },
          },
        },
        animation: animated
          ? {
              duration: getAnimationDuration(),
              animateRotate: true,
              animateScale: true,
            }
          : false,
      }

      return mergeChartOptions(customOptions, options)
    }, [showLegend, showPercentage, animated, options, total])

    // Export function
    const handleExport = React.useCallback(() => {
      if (chartRef.current) {
        exportChart(chartRef.current.canvas, 'png', isDonut ? 'donut-chart' : 'pie-chart')
      }
    }, [isDonut])

    // Check if data is empty
    const isEmpty = !data || data.length === 0

    const ChartComponent = isDonut ? Doughnut : Pie

    return (
      <ChartWrapper
        ref={ref}
        className={className}
        isLoading={isLoading}
        error={error}
        emptyMessage={isEmpty ? (emptyMessage || 'No data available') : undefined}
        exportable
        onExport={handleExport}
        ariaLabel={ariaLabel || (isDonut ? 'Donut chart' : 'Pie chart')}
        height={height}
        {...wrapperProps}
      >
        {!isEmpty && (
          <ChartComponent
            ref={chartRef}
            data={chartData}
            options={{
              ...chartOptions,
              cutout: cutout || (isDonut ? '60%' : 0),
            } as any}
            aria-label={ariaLabel || (isDonut ? 'Donut chart visualization' : 'Pie chart visualization')}
          />
        )}
      </ChartWrapper>
    )
  }
)

PieChart.displayName = 'PieChart'

/**
 * DonutChart component
 * 
 * Convenience wrapper for PieChart with a cutout
 */
export const DonutChart = React.forwardRef<HTMLDivElement, PieChartProps>(
  (props, ref) => {
    return <PieChart ref={ref} {...props} cutout={props.cutout || '60%'} />
  }
)

DonutChart.displayName = 'DonutChart'
