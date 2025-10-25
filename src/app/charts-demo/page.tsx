'use client'

import * as React from 'react'
import {
  LineChart,
  BarChart,
  PieChart,
  DonutChart,
  AreaChart,
  ScatterChart,
  GaugeChart,
  HeatmapChart,
} from '@/components/ui/chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react'

export default function ChartsDemo() {
  const [refreshKey, setRefreshKey] = React.useState(0)

  // Sample data for Line Chart
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [65, 59, 80, 81, 56, 95],
      },
      {
        label: 'Expenses',
        data: [45, 50, 60, 55, 48, 60],
      },
    ],
  }

  // Sample data for Bar Chart
  const barChartData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: '2023',
        data: [120, 150, 180, 200],
      },
      {
        label: '2024',
        data: [140, 170, 190, 220],
      },
    ],
  }

  // Sample data for Pie Chart
  const pieChartData = [
    { label: 'Product A', value: 300 },
    { label: 'Product B', value: 500 },
    { label: 'Product C', value: 200 },
    { label: 'Product D', value: 400 },
  ]

  // Sample data for Area Chart
  const areaChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Sales',
        data: [100, 150, 200, 180],
      },
      {
        label: 'Returns',
        data: [20, 25, 30, 28],
      },
    ],
  }

  // Sample data for Scatter Chart
  const scatterChartData = {
    datasets: [
      {
        label: 'Dataset 1',
        data: [
          { x: 10, y: 20 },
          { x: 15, y: 25 },
          { x: 20, y: 30 },
          { x: 25, y: 22 },
          { x: 30, y: 35 },
        ],
      },
      {
        label: 'Dataset 2',
        data: [
          { x: 12, y: 18 },
          { x: 18, y: 28 },
          { x: 22, y: 25 },
          { x: 28, y: 32 },
          { x: 32, y: 38 },
        ],
      },
    ],
  }

  // Sample data for Heatmap
  const heatmapData = [
    { x: 'Mon', y: 'Morning', value: 10 },
    { x: 'Mon', y: 'Afternoon', value: 15 },
    { x: 'Mon', y: 'Evening', value: 8 },
    { x: 'Tue', y: 'Morning', value: 20 },
    { x: 'Tue', y: 'Afternoon', value: 25 },
    { x: 'Tue', y: 'Evening', value: 12 },
    { x: 'Wed', y: 'Morning', value: 15 },
    { x: 'Wed', y: 'Afternoon', value: 18 },
    { x: 'Wed', y: 'Evening', value: 10 },
    { x: 'Thu', y: 'Morning', value: 18 },
    { x: 'Thu', y: 'Afternoon', value: 22 },
    { x: 'Thu', y: 'Evening', value: 14 },
    { x: 'Fri', y: 'Morning', value: 25 },
    { x: 'Fri', y: 'Afternoon', value: 30 },
    { x: 'Fri', y: 'Evening', value: 20 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Charts Component Library</h1>
              <p className="text-muted-foreground text-base sm:text-lg">
                Comprehensive data visualization components with responsive design and accessibility features
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setRefreshKey(prev => prev + 1)}
              aria-label="Refresh charts"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>TypeScript</Badge>
            <Badge variant="secondary">Chart.js</Badge>
            <Badge variant="secondary">Responsive</Badge>
            <Badge variant="secondary">Accessible</Badge>
            <Badge variant="secondary">Animated</Badge>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="space-y-8" key={refreshKey}>
          {/* Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Line Chart</CardTitle>
              <CardDescription>
                Time series data, trends, and comparisons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                data={lineChartData}
                title="Monthly Performance"
                description="Revenue and expenses over the past 6 months"
                height={300}
                showLegend
                showGrid
              />
            </CardContent>
          </Card>

          {/* Bar Chart - Vertical */}
          <Card>
            <CardHeader>
              <CardTitle>Bar Chart (Vertical)</CardTitle>
              <CardDescription>
                Categorical data, comparisons, and rankings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={barChartData}
                title="Quarterly Revenue Comparison"
                description="Year-over-year quarterly comparison"
                height={300}
                orientation="vertical"
                showLegend
                showGrid
              />
            </CardContent>
          </Card>

          {/* Bar Chart - Horizontal */}
          <Card>
            <CardHeader>
              <CardTitle>Bar Chart (Horizontal)</CardTitle>
              <CardDescription>
                Alternative layout for better label readability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={barChartData}
                title="Quarterly Revenue (Horizontal)"
                height={300}
                orientation="horizontal"
                showLegend
                showGrid
              />
            </CardContent>
          </Card>

          {/* Pie and Donut Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pie Chart</CardTitle>
                <CardDescription>
                  Proportional data and percentages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={pieChartData}
                  title="Sales by Product"
                  height={300}
                  showLegend
                  showPercentage
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Donut Chart</CardTitle>
                <CardDescription>
                  Progress indicators and completion status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DonutChart
                  data={pieChartData}
                  title="Market Share"
                  height={300}
                  showLegend
                  showPercentage
                />
              </CardContent>
            </Card>
          </div>

          {/* Area Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Area Chart</CardTitle>
              <CardDescription>
                Cumulative data and trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AreaChart
                data={areaChartData}
                title="Weekly Sales and Returns"
                description="Tracking sales performance and return rates"
                height={300}
                showLegend
                showGrid
              />
            </CardContent>
          </Card>

          {/* Scatter Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Scatter Plot</CardTitle>
              <CardDescription>
                Correlation analysis and data distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScatterChart
                data={scatterChartData}
                title="Correlation Analysis"
                description="Relationship between two variables"
                height={300}
                showLegend
                showGrid
              />
            </CardContent>
          </Card>

          {/* Gauge Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gauge Chart</CardTitle>
                <CardDescription>Performance score</CardDescription>
              </CardHeader>
              <CardContent>
                <GaugeChart
                  value={75}
                  min={0}
                  max={100}
                  unit="%"
                  title="Overall Performance"
                  segments={[
                    { threshold: 33, color: '#ef4444', label: 'Low' },
                    { threshold: 66, color: '#f59e0b', label: 'Medium' },
                    { threshold: 100, color: '#10b981', label: 'High' },
                  ]}
                  height={200}
                  showValue
                  showLabel
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CPU Usage</CardTitle>
                <CardDescription>System metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <GaugeChart
                  value={45}
                  min={0}
                  max={100}
                  unit="%"
                  title="CPU Usage"
                  segments={[
                    { threshold: 50, color: '#10b981', label: 'Normal' },
                    { threshold: 80, color: '#f59e0b', label: 'Warning' },
                    { threshold: 100, color: '#ef4444', label: 'Critical' },
                  ]}
                  height={200}
                  showValue
                  showLabel
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Satisfaction</CardTitle>
                <CardDescription>NPS Score</CardDescription>
              </CardHeader>
              <CardContent>
                <GaugeChart
                  value={85}
                  min={0}
                  max={100}
                  unit=""
                  title="NPS Score"
                  segments={[
                    { threshold: 50, color: '#ef4444', label: 'Detractor' },
                    { threshold: 70, color: '#f59e0b', label: 'Passive' },
                    { threshold: 100, color: '#10b981', label: 'Promoter' },
                  ]}
                  height={200}
                  showValue
                  showLabel
                />
              </CardContent>
            </Card>
          </div>

          {/* Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Heatmap</CardTitle>
              <CardDescription>
                Data density and correlation matrices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HeatmapChart
                data={heatmapData}
                title="Weekly Activity Pattern"
                description="User activity throughout the week"
                height={350}
                showValues
                showLegend
              />
            </CardContent>
          </Card>

          {/* Loading State Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Loading State</CardTitle>
              <CardDescription>
                Charts display skeleton loaders while data is being fetched
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                data={lineChartData}
                title="Loading Chart..."
                height={300}
                isLoading
              />
            </CardContent>
          </Card>

          {/* Error State Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Error State</CardTitle>
              <CardDescription>
                Graceful error handling with clear messaging
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={barChartData}
                title="Error Loading Data"
                height={300}
                error="Failed to fetch chart data. Please try again later."
              />
            </CardContent>
          </Card>

          {/* Empty State Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Empty State</CardTitle>
              <CardDescription>
                Clear messaging when no data is available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PieChart
                data={[]}
                title="No Data Available"
                height={300}
                emptyMessage="There is currently no data to display. Please check back later."
              />
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>
              Comprehensive chart library with modern features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">📊 Multiple Chart Types</h3>
                <p className="text-sm text-muted-foreground">
                  Line, Bar, Pie, Donut, Area, Scatter, Gauge, and Heatmap charts
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">📱 Responsive Design</h3>
                <p className="text-sm text-muted-foreground">
                  Charts adapt seamlessly to different screen sizes
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">♿ Accessible</h3>
                <p className="text-sm text-muted-foreground">
                  WCAG compliant with screen reader support and keyboard navigation
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🎨 Themeable</h3>
                <p className="text-sm text-muted-foreground">
                  Supports light/dark mode with design token integration
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">✨ Animated</h3>
                <p className="text-sm text-muted-foreground">
                  Smooth transitions that respect motion preferences
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">📥 Exportable</h3>
                <p className="text-sm text-muted-foreground">
                  Export charts as PNG, JPG, or SVG images
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🔄 Loading States</h3>
                <p className="text-sm text-muted-foreground">
                  Built-in skeleton loaders for better UX
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">⚠️ Error Handling</h3>
                <p className="text-sm text-muted-foreground">
                  Graceful error states with clear messaging
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">📦 TypeScript</h3>
                <p className="text-sm text-muted-foreground">
                  Full TypeScript support with comprehensive types
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
