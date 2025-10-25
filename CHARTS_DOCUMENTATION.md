# Charts Component Library Documentation

## Overview

The Charts Component Library provides a comprehensive set of data visualization components built with Chart.js and React. It includes support for multiple chart types, responsive design, accessibility features, and seamless integration with the design system.

## Features

- **📊 Multiple Chart Types**: Line, Bar, Pie, Donut, Area, Scatter, Gauge, and Heatmap
- **📱 Responsive Design**: Charts adapt to all screen sizes
- **♿ Accessible**: WCAG compliant with screen reader support
- **🎨 Themeable**: Supports light/dark mode
- **✨ Animated**: Smooth transitions with motion preference support
- **📥 Exportable**: Export charts as PNG, JPG, or SVG
- **🔄 Loading States**: Built-in skeleton loaders
- **⚠️ Error Handling**: Graceful error states
- **📦 TypeScript**: Full TypeScript support

## Installation

The charts library uses Chart.js and react-chartjs-2:

```bash
npm install chart.js react-chartjs-2
```

## Components

### LineChart

Displays time series data, trends, and comparisons.

```tsx
import { LineChart } from '@/components/ui/chart'

<LineChart
  data={{
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      label: 'Sales',
      data: [65, 59, 80, 81, 56],
    }]
  }}
  title="Monthly Sales"
  showLegend
  showGrid
  height={300}
/>
```

**Props:**
- `data`: Chart data with labels and datasets
- `title?`: Chart title
- `description?`: Chart description
- `showLegend?`: Show/hide legend (default: true)
- `showGrid?`: Show/hide grid lines (default: true)
- `enableZoom?`: Enable zoom functionality (default: false)
- `height?`: Chart height (default: 300)
- `isLoading?`: Show loading state
- `error?`: Show error state
- `emptyMessage?`: Custom empty state message

### BarChart

Displays categorical data, comparisons, and rankings.

```tsx
import { BarChart } from '@/components/ui/chart'

<BarChart
  data={{
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{
      label: 'Revenue',
      data: [120, 150, 180, 200],
    }]
  }}
  title="Quarterly Revenue"
  orientation="vertical"
  stacked={false}
  height={300}
/>
```

**Props:**
- `data`: Chart data with labels and datasets
- `orientation?`: 'vertical' or 'horizontal' (default: 'vertical')
- `stacked?`: Enable stacked bars (default: false)
- `showLegend?`: Show/hide legend (default: true)
- `showGrid?`: Show/hide grid lines (default: true)
- `height?`: Chart height (default: 300)

### PieChart / DonutChart

Displays proportional data and percentages.

```tsx
import { PieChart, DonutChart } from '@/components/ui/chart'

<PieChart
  data={[
    { label: 'Product A', value: 300 },
    { label: 'Product B', value: 500 },
    { label: 'Product C', value: 200 },
  ]}
  title="Sales by Product"
  showLegend
  showPercentage
  height={300}
/>

<DonutChart
  data={[...]}
  title="Market Share"
  cutout="60%"
  height={300}
/>
```

**Props:**
- `data`: Array of data points with label and value
- `showLegend?`: Show/hide legend (default: true)
- `showPercentage?`: Show percentages in tooltip (default: false)
- `cutout?`: Donut hole size (for DonutChart)
- `height?`: Chart height (default: 300)

### AreaChart

Displays cumulative data and trends over time.

```tsx
import { AreaChart } from '@/components/ui/chart'

<AreaChart
  data={{
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Sales',
      data: [100, 150, 200, 180],
    }]
  }}
  title="Weekly Sales"
  stacked={false}
  height={300}
/>
```

**Props:**
- `data`: Chart data with labels and datasets
- `stacked?`: Enable stacked areas (default: false)
- `showLegend?`: Show/hide legend (default: true)
- `showGrid?`: Show/hide grid lines (default: true)
- `height?`: Chart height (default: 300)

### ScatterChart

Displays correlation analysis and data distribution.

```tsx
import { ScatterChart } from '@/components/ui/chart'

<ScatterChart
  data={{
    datasets: [{
      label: 'Dataset 1',
      data: [
        { x: 10, y: 20 },
        { x: 15, y: 25 },
        { x: 20, y: 30 },
      ],
    }]
  }}
  title="Correlation Analysis"
  height={300}
/>
```

**Props:**
- `data`: Chart data with datasets containing x,y coordinates
- `showLegend?`: Show/hide legend (default: true)
- `showGrid?`: Show/hide grid lines (default: true)
- `height?`: Chart height (default: 300)

### GaugeChart

Displays performance metrics and KPIs.

```tsx
import { GaugeChart } from '@/components/ui/chart'

<GaugeChart
  value={75}
  min={0}
  max={100}
  unit="%"
  segments={[
    { threshold: 33, color: '#ef4444', label: 'Low' },
    { threshold: 66, color: '#f59e0b', label: 'Medium' },
    { threshold: 100, color: '#10b981', label: 'High' },
  ]}
  title="Performance Score"
  height={250}
/>
```

**Props:**
- `value`: Current value
- `min?`: Minimum value (default: 0)
- `max?`: Maximum value (default: 100)
- `unit?`: Value unit (e.g., '%', 'ms')
- `segments?`: Color segments with thresholds
- `showValue?`: Show value in center (default: true)
- `showLabel?`: Show segment labels (default: true)
- `height?`: Chart height (default: 250)

### HeatmapChart

Displays data density and correlation matrices.

```tsx
import { HeatmapChart } from '@/components/ui/chart'

<HeatmapChart
  data={[
    { x: 'Mon', y: 'Morning', value: 10 },
    { x: 'Mon', y: 'Afternoon', value: 15 },
    { x: 'Tue', y: 'Morning', value: 20 },
  ]}
  title="Activity Heatmap"
  showValues
  showLegend
  height={350}
/>
```

**Props:**
- `data`: Array of data points with x, y, and value
- `xLabels?`: Custom x-axis labels
- `yLabels?`: Custom y-axis labels
- `colorScale?`: Custom color scale array
- `showValues?`: Show values in cells (default: false)
- `showLegend?`: Show color legend (default: true)
- `height?`: Chart height (default: 300)

## Common Props

All chart components support these common props:

- `id?`: Unique identifier
- `className?`: Additional CSS classes
- `isLoading?`: Show loading skeleton
- `error?`: Show error state (string or Error object)
- `emptyMessage?`: Custom empty state message
- `ariaLabel?`: Accessibility label
- `animated?`: Enable animations (default: true)
- `responsive?`: Enable responsiveness (default: true)

## States

### Loading State

```tsx
<LineChart
  data={data}
  isLoading={true}
  title="Loading..."
  height={300}
/>
```

### Error State

```tsx
<BarChart
  data={data}
  error="Failed to load data"
  title="Error"
  height={300}
/>
```

### Empty State

```tsx
<PieChart
  data={[]}
  emptyMessage="No data available"
  title="Empty"
  height={300}
/>
```

## Utilities

### Formatting Functions

```tsx
import {
  formatNumber,
  formatCurrency,
  formatPercentage,
} from '@/components/ui/chart'

formatNumber(1234567) // "1.2M"
formatCurrency(1234.56) // "$1,234.56"
formatPercentage(75.5) // "75.5%"
```

### Theme Utilities

```tsx
import {
  getThemeMode,
  getGridColor,
  getTextColor,
  getChartColor,
} from '@/components/ui/chart'

const isDark = getThemeMode() === 'dark'
const gridColor = getGridColor()
const textColor = getTextColor()
const color = getChartColor(0) // Get first color from palette
```

### Export Functions

```tsx
import { exportChart } from '@/components/ui/chart'

const chartRef = useRef<HTMLCanvasElement>(null)

const handleExport = () => {
  exportChart(chartRef.current, 'png', 'my-chart')
}
```

## Theming

Charts automatically adapt to the current theme (light/dark mode) using design tokens:

```css
/* Colors are pulled from CSS variables */
--primary: 221.2 83.2% 53.3%
--success: 120 50% 40%
--warning: 38 70% 50%
--error: 0 60% 50%
--info: 210 50% 50%
```

## Accessibility

All charts include:

- **ARIA labels**: Descriptive labels for screen readers
- **Keyboard navigation**: Interactive elements are keyboard accessible
- **Motion preferences**: Respects `prefers-reduced-motion`
- **Color contrast**: WCAG AA compliant colors
- **Focus indicators**: Clear focus states

## Responsive Design

Charts are mobile-first and responsive:

```tsx
<LineChart
  data={data}
  height={300} // Fixed height
  responsive={true} // Width adapts to container
  maintainAspectRatio={false}
/>
```

## Performance

For large datasets:

1. **Limit data points**: Consider aggregating data
2. **Disable animations**: Set `animated={false}`
3. **Use smaller point radius**: Reduce visual complexity
4. **Implement pagination**: Load data in chunks

```tsx
<LineChart
  data={largeDataset}
  animated={false}
  options={{
    elements: {
      point: {
        radius: 0, // Hide points for better performance
      },
    },
  }}
/>
```

## Examples

### Dashboard Metrics

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <GaugeChart value={75} title="CPU Usage" unit="%" />
  <GaugeChart value={60} title="Memory" unit="%" />
  <GaugeChart value={85} title="Disk Space" unit="%" />
</div>
```

### Analytics Dashboard

```tsx
<div className="space-y-6">
  <LineChart
    data={timeSeriesData}
    title="User Growth"
    height={300}
  />
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <BarChart
      data={categoryData}
      title="Revenue by Category"
      height={250}
    />
    <PieChart
      data={distributionData}
      title="Traffic Sources"
      height={250}
    />
  </div>
</div>
```

### Comparison View

```tsx
<BarChart
  data={{
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      { label: '2023', data: [100, 120, 140, 160] },
      { label: '2024', data: [110, 130, 150, 180] },
    ],
  }}
  title="Year over Year Comparison"
  stacked={false}
  height={350}
/>
```

## Best Practices

1. **Choose the right chart**: Match chart type to data structure
2. **Limit data points**: Keep charts readable (max 20-30 points)
3. **Use clear labels**: Descriptive titles and axis labels
4. **Provide context**: Add descriptions and legends
5. **Test accessibility**: Verify with screen readers
6. **Optimize performance**: Disable features for large datasets
7. **Handle states**: Always handle loading, error, and empty states
8. **Export functionality**: Allow users to save visualizations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## TypeScript

Full TypeScript support with comprehensive type definitions:

```tsx
import type {
  LineChartProps,
  BarChartProps,
  PieChartProps,
  ChartDataset,
  DataPoint,
} from '@/components/ui/chart'
```

## Testing

Run the chart tests:

```bash
npm test -- tests/charts.spec.ts
```

## Demo

View the live demo at `/charts-demo` to see all chart types in action.
