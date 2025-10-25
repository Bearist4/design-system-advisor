# Charts Component Library

A comprehensive, accessible, and themeable chart library built with Chart.js and React.

## Quick Start

```tsx
import { LineChart, BarChart, PieChart } from '@/components/ui/chart'

function Dashboard() {
  return (
    <div>
      <LineChart
        data={{
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [{
            label: 'Revenue',
            data: [65, 59, 80, 81, 56]
          }]
        }}
        title="Monthly Revenue"
        height={300}
      />
    </div>
  )
}
```

## Available Components

- **LineChart** - Time series and trend data
- **BarChart** - Categorical comparisons (vertical/horizontal)
- **PieChart** - Proportional data
- **DonutChart** - Progress and completion status
- **AreaChart** - Cumulative trends
- **ScatterChart** - Correlation analysis
- **GaugeChart** - KPI and performance metrics
- **HeatmapChart** - Data density and correlation matrices

## Features

✅ **Responsive** - Adapts to all screen sizes  
✅ **Accessible** - WCAG 2.1 AA compliant  
✅ **Themeable** - Light/dark mode support  
✅ **Animated** - Smooth transitions  
✅ **Exportable** - PNG/JPG export  
✅ **TypeScript** - Full type definitions  
✅ **Loading States** - Built-in skeletons  
✅ **Error Handling** - Graceful error states  

## Documentation

See [CHARTS_DOCUMENTATION.md](/CHARTS_DOCUMENTATION.md) for complete API reference.

## Demo

View live examples at `/charts-demo`

## Files

- `index.ts` - Main exports
- `types.ts` - TypeScript definitions
- `utils.ts` - Helper functions
- `ChartWrapper.tsx` - Base wrapper
- `LineChart.tsx` - Line chart
- `BarChart.tsx` - Bar chart
- `PieChart.tsx` - Pie/Donut charts
- `AreaChart.tsx` - Area chart
- `ScatterChart.tsx` - Scatter plot
- `GaugeChart.tsx` - Gauge chart
- `HeatmapChart.tsx` - Heatmap

## Support

For issues or questions, see the main documentation or open an issue.
