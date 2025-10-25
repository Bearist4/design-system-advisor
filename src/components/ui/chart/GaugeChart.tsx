'use client'

import * as React from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { ChartWrapper } from './ChartWrapper'
import { GaugeChartProps } from './types'
import {
  getDefaultChartOptions,
  mergeChartOptions,
  exportChart,
  getAnimationDuration,
} from './utils'
import { cn } from '@/lib/utils'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

/**
 * GaugeChart component
 * 
 * Displays performance metrics and KPIs using a gauge visualization.
 * Shows a value within a min-max range with optional color segments.
 * 
 * @example
 * ```tsx
 * <GaugeChart
 *   value={75}
 *   min={0}
 *   max={100}
 *   unit="%"
 *   segments={[
 *     { threshold: 33, color: '#ef4444', label: 'Low' },
 *     { threshold: 66, color: '#f59e0b', label: 'Medium' },
 *     { threshold: 100, color: '#10b981', label: 'High' },
 *   ]}
 *   title="Performance Score"
 * />
 * ```
 */
export const GaugeChart = React.forwardRef<HTMLDivElement, GaugeChartProps>(
  (
    {
      value,
      min = 0,
      max = 100,
      unit = '',
      segments,
      showValue = true,
      showLabel = true,
      animated = true,
      isLoading,
      error,
      emptyMessage,
      height = 250,
      ariaLabel,
      className,
      ...wrapperProps
    },
    ref
  ) => {
    const chartRef = React.useRef<ChartJS<'doughnut'>>(null)

    // Normalize value to percentage
    const normalizedValue = ((value - min) / (max - min)) * 100
    const clampedValue = Math.max(0, Math.min(100, normalizedValue))

    // Determine segment color based on value
    const getSegmentColor = React.useCallback(() => {
      if (!segments || segments.length === 0) {
        return 'hsl(var(--primary))'
      }

      const normalizedVal = (value / (max - min)) * 100
      for (const segment of segments) {
        const segmentThreshold = ((segment.threshold - min) / (max - min)) * 100
        if (normalizedVal <= segmentThreshold) {
          return segment.color
        }
      }
      
      return segments[segments.length - 1].color
    }, [value, min, max, segments])

    const valueColor = getSegmentColor()

    // Prepare chart data
    const chartData = React.useMemo(() => {
      return {
        datasets: [
          {
            data: [clampedValue, 100 - clampedValue],
            backgroundColor: [valueColor, 'hsl(var(--muted) / 0.2)'],
            borderWidth: 0,
            circumference: 180,
            rotation: 270,
          },
        ],
      }
    }, [clampedValue, valueColor])

    // Prepare chart options
    const chartOptions = React.useMemo(() => {
      const defaultOptions = getDefaultChartOptions<'doughnut'>()

      const customOptions: Partial<ChartOptions<'doughnut'>> = {
        ...defaultOptions,
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          ...defaultOptions.plugins,
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        animation: animated
          ? {
              duration: getAnimationDuration(1000),
              animateRotate: true,
              animateScale: false,
            }
          : false,
      }

      return mergeChartOptions(customOptions, undefined)
    }, [animated])

    // Export function
    const handleExport = React.useCallback(() => {
      if (chartRef.current) {
        exportChart(chartRef.current.canvas, 'png', 'gauge-chart')
      }
    }, [])

    // Center text plugin
    const centerTextPlugin = React.useMemo(() => ({
      id: 'centerText',
      afterDraw: (chart: any) => {
        if (!showValue) return

        const ctx = chart.ctx
        const centerX = (chart.chartArea.left + chart.chartArea.right) / 2
        const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2 + 20

        ctx.save()
        ctx.font = 'bold 32px var(--font-sans)'
        ctx.fillStyle = 'hsl(var(--foreground))'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(`${value}${unit}`, centerX, centerY)
        ctx.restore()
      },
    }), [showValue, value, unit])

    React.useEffect(() => {
      if (chartRef.current) {
        // Register the plugin
        ChartJS.register(centerTextPlugin as any)
      }
    }, [centerTextPlugin])

    // Check if data is invalid
    const isEmpty = value === null || value === undefined

    return (
      <ChartWrapper
        ref={ref}
        className={className}
        isLoading={isLoading}
        error={error}
        emptyMessage={isEmpty ? (emptyMessage || 'No data available') : undefined}
        exportable
        onExport={handleExport}
        ariaLabel={ariaLabel || `Gauge chart showing ${value}${unit}`}
        height={height}
        {...wrapperProps}
      >
        {!isEmpty && (
          <div className="relative">
            <Doughnut
              ref={chartRef}
              data={chartData}
              options={chartOptions}
              plugins={[centerTextPlugin]}
              aria-label={ariaLabel || `Gauge showing ${value}${unit} out of ${max}${unit}`}
            />
            {showLabel && segments && segments.length > 0 && (
              <div className="flex justify-center gap-4 mt-4">
                {segments.map((segment, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className={cn('w-3 h-3 rounded-full')}
                      style={{ backgroundColor: segment.color }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {segment.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </ChartWrapper>
    )
  }
)

GaugeChart.displayName = 'GaugeChart'
