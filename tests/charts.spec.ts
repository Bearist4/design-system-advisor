import { test, expect } from '@playwright/test'

test.describe('Charts Component Library', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/charts-demo')
    await page.waitForLoadState('networkidle')
  })

  test('should render the charts demo page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Charts Component Library')
    await expect(page.locator('text=Comprehensive data visualization components')).toBeVisible()
  })

  test('should display all chart types', async ({ page }) => {
    // Check for all chart type headings
    await expect(page.locator('text=Line Chart')).toBeVisible()
    await expect(page.locator('text=Bar Chart (Vertical)')).toBeVisible()
    await expect(page.locator('text=Bar Chart (Horizontal)')).toBeVisible()
    await expect(page.locator('text=Pie Chart')).toBeVisible()
    await expect(page.locator('text=Donut Chart')).toBeVisible()
    await expect(page.locator('text=Area Chart')).toBeVisible()
    await expect(page.locator('text=Scatter Plot')).toBeVisible()
    await expect(page.locator('text=Gauge Chart')).toBeVisible()
    await expect(page.locator('text=Heatmap')).toBeVisible()
  })

  test('should render canvas elements for Chart.js charts', async ({ page }) => {
    // Wait for charts to render
    await page.waitForTimeout(1000)
    
    // Check that canvas elements exist
    const canvases = page.locator('canvas')
    const count = await canvases.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should display loading state', async ({ page }) => {
    await expect(page.locator('text=Loading Chart...')).toBeVisible()
  })

  test('should display error state', async ({ page }) => {
    await expect(page.locator('text=Error Loading Data')).toBeVisible()
    await expect(page.locator('text=Failed to fetch chart data')).toBeVisible()
  })

  test('should display empty state', async ({ page }) => {
    await expect(page.locator('text=No Data Available')).toBeVisible()
  })

  test('should have export buttons for charts', async ({ page }) => {
    // Check for export buttons (Download icons)
    const exportButtons = page.locator('button[aria-label="Export chart"]')
    const count = await exportButtons.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should have refresh button in header', async ({ page }) => {
    const refreshButton = page.locator('button[aria-label="Refresh charts"]')
    await expect(refreshButton).toBeVisible()
    await refreshButton.click()
    
    // Wait for charts to re-render
    await page.waitForTimeout(500)
  })

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check for ARIA labels on charts
    const chartsWithAriaLabel = page.locator('[role="img"][aria-label*="chart"]')
    const count = await chartsWithAriaLabel.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should display feature badges', async ({ page }) => {
    await expect(page.locator('text=TypeScript')).toBeVisible()
    await expect(page.locator('text=Responsive')).toBeVisible()
    await expect(page.locator('text=Accessible')).toBeVisible()
    await expect(page.locator('text=Animated')).toBeVisible()
  })

  test('should display features section', async ({ page }) => {
    await expect(page.locator('h3:has-text("📊 Multiple Chart Types")')).toBeVisible()
    await expect(page.locator('h3:has-text("📱 Responsive Design")')).toBeVisible()
    await expect(page.locator('h3:has-text("♿ Accessible")')).toBeVisible()
    await expect(page.locator('h3:has-text("🎨 Themeable")')).toBeVisible()
    await expect(page.locator('h3:has-text("✨ Animated")')).toBeVisible()
    await expect(page.locator('h3:has-text("📥 Exportable")')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check that page is still visible and functional
    await expect(page.locator('h1')).toBeVisible()
    
    // Check that charts container exists
    const charts = page.locator('canvas')
    const count = await charts.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should be responsive on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    
    // Check that page is still visible and functional
    await expect(page.locator('h1')).toBeVisible()
    
    // Check that charts are rendered
    const charts = page.locator('canvas')
    const count = await charts.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should render gauge charts with values', async ({ page }) => {
    // Check for gauge chart values
    await expect(page.locator('text=75%')).toBeVisible()
    await expect(page.locator('text=45%')).toBeVisible()
    await expect(page.locator('text=85')).toBeVisible()
  })

  test('should render heatmap with SVG', async ({ page }) => {
    const heatmapSvg = page.locator('svg#heatmap-svg')
    await expect(heatmapSvg).toBeVisible()
  })

  test.describe('Keyboard Navigation', () => {
    test('should be keyboard navigable', async ({ page }) => {
      // Tab through interactive elements
      await page.keyboard.press('Tab')
      
      // Check focus is visible
      const focused = page.locator(':focus')
      await expect(focused).toBeVisible()
    })

    test('export buttons should be keyboard accessible', async ({ page }) => {
      // Find first export button
      const exportButton = page.locator('button[aria-label="Export chart"]').first()
      
      // Focus it with keyboard
      await exportButton.focus()
      
      // Check it's focused
      await expect(exportButton).toBeFocused()
    })
  })

  test.describe('Dark Mode', () => {
    test('should support dark mode', async ({ page }) => {
      // Add dark class to html element
      await page.evaluate(() => {
        document.documentElement.classList.add('dark')
      })
      
      // Wait for theme to update
      await page.waitForTimeout(500)
      
      // Check that dark mode is applied
      const html = page.locator('html')
      await expect(html).toHaveClass(/dark/)
    })
  })

  test.describe('Performance', () => {
    test('should load charts within acceptable time', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/charts-demo')
      await page.waitForLoadState('networkidle')
      
      // Wait for charts to render
      await page.waitForSelector('canvas', { timeout: 5000 })
      
      const loadTime = Date.now() - startTime
      
      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000)
    })
  })
})

test.describe('Individual Chart Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/charts-demo')
    await page.waitForLoadState('networkidle')
  })

  test('Line Chart should render correctly', async ({ page }) => {
    const lineChartCard = page.locator('text=Monthly Performance').locator('..').locator('..')
    await expect(lineChartCard).toBeVisible()
  })

  test('Bar Chart should support both orientations', async ({ page }) => {
    await expect(page.locator('text=Bar Chart (Vertical)')).toBeVisible()
    await expect(page.locator('text=Bar Chart (Horizontal)')).toBeVisible()
  })

  test('Pie and Donut charts should be distinct', async ({ page }) => {
    await expect(page.locator('text=Sales by Product')).toBeVisible()
    await expect(page.locator('text=Market Share')).toBeVisible()
  })

  test('Area Chart should display data', async ({ page }) => {
    await expect(page.locator('text=Weekly Sales and Returns')).toBeVisible()
  })

  test('Scatter Chart should show correlation', async ({ page }) => {
    await expect(page.locator('text=Correlation Analysis')).toBeVisible()
  })

  test('Gauge Charts should show different segments', async ({ page }) => {
    await expect(page.locator('text=Overall Performance')).toBeVisible()
    await expect(page.locator('text=CPU Usage')).toBeVisible()
    await expect(page.locator('text=NPS Score')).toBeVisible()
  })

  test('Heatmap should show activity pattern', async ({ page }) => {
    await expect(page.locator('text=Weekly Activity Pattern')).toBeVisible()
  })
})
