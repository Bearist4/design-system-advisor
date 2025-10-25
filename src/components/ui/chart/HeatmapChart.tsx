'use client'

import * as React from 'react'
import { ChartWrapper } from './ChartWrapper'
import { HeatmapProps } from './types'
import { cn } from '@/lib/utils'

/**
 * HeatmapChart component
 * 
 * Displays data density and correlation matrices using a color-coded grid.
 * Custom implementation using SVG for flexibility.
 * 
 * @example
 * ```tsx
 * <HeatmapChart
 *   data={[
 *     { x: 'Mon', y: 'Morning', value: 10 },
 *     { x: 'Mon', y: 'Afternoon', value: 15 },
 *     { x: 'Tue', y: 'Morning', value: 20 },
 *   ]}
 *   title="Activity Heatmap"
 *   showValues
 * />
 * ```
 */
export const HeatmapChart = React.forwardRef<HTMLDivElement, HeatmapProps>(
  (
    {
      data,
      xLabels,
      yLabels,
      colorScale = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
      showValues = false,
      showLegend = true,
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
    // Extract unique labels if not provided
    const uniqueXLabels = React.useMemo(
      () => xLabels || Array.from(new Set(data.map(d => String(d.x)))).sort(),
      [data, xLabels]
    )

    const uniqueYLabels = React.useMemo(
      () => yLabels || Array.from(new Set(data.map(d => String(d.y)))).sort(),
      [data, yLabels]
    )

    // Calculate min/max values for color scaling
    const { minValue, maxValue } = React.useMemo(() => {
      const values = data.map(d => d.value)
      return {
        minValue: Math.min(...values),
        maxValue: Math.max(...values),
      }
    }, [data])

    // Get color for a value
    const getColor = React.useCallback(
      (value: number) => {
        const normalized = (value - minValue) / (maxValue - minValue)
        const index = Math.min(
          Math.floor(normalized * colorScale.length),
          colorScale.length - 1
        )
        return colorScale[index]
      },
      [minValue, maxValue, colorScale]
    )

    // Get cell data
    const getCellData = React.useCallback(
      (x: string, y: string) => {
        return data.find(d => String(d.x) === x && String(d.y) === y)
      },
      [data]
    )

    // Calculate cell dimensions
    const cellWidth = 60
    const cellHeight = 40
    const labelWidth = 100
    const labelHeight = 30
    
    const svgWidth = uniqueXLabels.length * cellWidth + labelWidth
    const svgHeight = uniqueYLabels.length * cellHeight + labelHeight

    // Export function
    const handleExport = React.useCallback(() => {
      const svgElement = document.getElementById('heatmap-svg')
      if (!svgElement) return

      const svgData = new XMLSerializer().serializeToString(svgElement)
      const canvas = document.createElement('canvas')
      canvas.width = svgWidth
      canvas.height = svgHeight
      
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
        const pngFile = canvas.toDataURL('image/png')
        
        const downloadLink = document.createElement('a')
        downloadLink.download = 'heatmap-chart.png'
        downloadLink.href = pngFile
        downloadLink.click()
      }
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
    }, [svgWidth, svgHeight])

    // Check if data is empty
    const isEmpty = !data || data.length === 0

    return (
      <ChartWrapper
        ref={ref}
        className={className}
        isLoading={isLoading}
        error={error}
        emptyMessage={isEmpty ? (emptyMessage || 'No data available') : undefined}
        exportable
        onExport={handleExport}
        ariaLabel={ariaLabel || 'Heatmap chart'}
        height={height}
        {...wrapperProps}
      >
        {!isEmpty && (
          <div className="overflow-x-auto">
            <svg
              id="heatmap-svg"
              width={svgWidth}
              height={svgHeight}
              className="mx-auto"
              role="img"
              aria-label={ariaLabel || 'Heatmap visualization'}
            >
              {/* Y-axis labels */}
              {uniqueYLabels.map((label, index) => (
                <text
                  key={`y-${label}`}
                  x={labelWidth - 10}
                  y={labelHeight + index * cellHeight + cellHeight / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-foreground text-xs"
                >
                  {label}
                </text>
              ))}

              {/* X-axis labels */}
              {uniqueXLabels.map((label, index) => (
                <text
                  key={`x-${label}`}
                  x={labelWidth + index * cellWidth + cellWidth / 2}
                  y={labelHeight - 10}
                  textAnchor="middle"
                  className="fill-foreground text-xs"
                >
                  {label}
                </text>
              ))}

              {/* Heatmap cells */}
              {uniqueYLabels.map((yLabel, yIndex) =>
                uniqueXLabels.map((xLabel, xIndex) => {
                  const cellData = getCellData(xLabel, yLabel)
                  if (!cellData) return null

                  const color = getColor(cellData.value)

                  return (
                    <g key={`cell-${xLabel}-${yLabel}`}>
                      <rect
                        x={labelWidth + xIndex * cellWidth}
                        y={labelHeight + yIndex * cellHeight}
                        width={cellWidth - 2}
                        height={cellHeight - 2}
                        fill={color}
                        className="transition-opacity hover:opacity-80"
                        rx={4}
                      >
                        <title>{`${xLabel}, ${yLabel}: ${cellData.value}`}</title>
                      </rect>
                      {showValues && (
                        <text
                          x={labelWidth + xIndex * cellWidth + cellWidth / 2}
                          y={labelHeight + yIndex * cellHeight + cellHeight / 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className={cn(
                            'text-xs font-medium',
                            cellData.value > (minValue + maxValue) / 2
                              ? 'fill-white'
                              : 'fill-foreground'
                          )}
                        >
                          {cellData.value}
                        </text>
                      )}
                    </g>
                  )
                })
              )}
            </svg>

            {/* Color legend */}
            {showLegend && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-xs text-muted-foreground">{minValue}</span>
                <div className="flex gap-0.5">
                  {colorScale.map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-4 rounded-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{maxValue}</span>
              </div>
            )}
          </div>
        )}
      </ChartWrapper>
    )
  }
)

HeatmapChart.displayName = 'HeatmapChart'
