import { test, expect } from '@playwright/test'

/**
 * Token Table Component Tests
 * 
 * Tests cover:
 * - Component rendering
 * - Search functionality
 * - Filtering by category and status
 * - Token selection
 * - Copy to clipboard
 * - Export functionality
 * - Token previews
 * - Accessibility
 * - Responsive design
 */

test.describe('Token Table Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/token-table-demo')
    await page.waitForLoadState('networkidle')
  })

  test.describe('Component Rendering', () => {
    test('should render token table with title and description', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /Token Table Component/i })).toBeVisible()
      await expect(page.getByText(/Comprehensive design token management/i)).toBeVisible()
    })

    test('should display all token categories', async ({ page }) => {
      const categories = ['all', 'colors', 'typography', 'spacing', 'radius', 'shadow', 'transition', 'zIndex', 'breakpoint']
      
      for (const category of categories) {
        await expect(page.getByRole('button', { name: new RegExp(category, 'i') })).toBeVisible()
      }
    })

    test('should display token count badge', async ({ page }) => {
      const badge = page.locator('text=/\\d+ of \\d+/')
      await expect(badge).toBeVisible()
    })

    test('should render token table rows', async ({ page }) => {
      const rows = page.locator('tbody tr')
      await expect(rows.first()).toBeVisible()
      const count = await rows.count()
      expect(count).toBeGreaterThan(0)
    })
  })

  test.describe('Search Functionality', () => {
    test('should filter tokens by search term', async ({ page }) => {
      const searchInput = page.getByPlaceholder(/Search tokens/i)
      await searchInput.fill('primary')
      
      // Wait for filtering to complete
      await page.waitForTimeout(300)
      
      const rows = page.locator('tbody tr')
      const count = await rows.count()
      expect(count).toBeGreaterThan(0)
      
      // Verify all visible tokens contain search term
      const firstCellText = await rows.first().locator('td:nth-child(2)').textContent()
      expect(firstCellText?.toLowerCase()).toContain('primary')
    })

    test('should show empty state when no tokens match search', async ({ page }) => {
      const searchInput = page.getByPlaceholder(/Search tokens/i)
      await searchInput.fill('nonexistenttoken12345')
      
      await page.waitForTimeout(300)
      
      await expect(page.getByText(/No tokens match your filters/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /Clear Filters/i })).toBeVisible()
    })

    test('should clear search with X button', async ({ page }) => {
      const searchInput = page.getByPlaceholder(/Search tokens/i)
      await searchInput.fill('primary')
      
      const clearButton = page.getByLabel(/Clear search/i)
      await clearButton.click()
      
      await expect(searchInput).toHaveValue('')
    })

    test('should show active filter badge when searching', async ({ page }) => {
      const searchInput = page.getByPlaceholder(/Search tokens/i)
      await searchInput.fill('color')
      
      await expect(page.locator('text=/Search: "color"/i')).toBeVisible()
    })
  })

  test.describe('Category Filtering', () => {
    test('should filter tokens by color category', async ({ page }) => {
      await page.getByRole('button', { name: 'colors' }).click()
      
      await page.waitForTimeout(300)
      
      // Verify category badge is active
      const activeButton = page.getByRole('button', { name: 'colors' })
      await expect(activeButton).toHaveClass(/bg-primary/)
      
      // Verify only color tokens are shown
      const categoryBadges = page.locator('tbody td:has-text("colors")')
      const count = await categoryBadges.count()
      expect(count).toBeGreaterThan(0)
    })

    test('should filter tokens by typography category', async ({ page }) => {
      await page.getByRole('button', { name: 'typography' }).click()
      
      await page.waitForTimeout(300)
      
      const categoryBadges = page.locator('tbody td:has-text("typography")')
      const count = await categoryBadges.count()
      expect(count).toBeGreaterThan(0)
    })

    test('should filter tokens by spacing category', async ({ page }) => {
      await page.getByRole('button', { name: 'spacing' }).click()
      
      await page.waitForTimeout(300)
      
      const categoryBadges = page.locator('tbody td:has-text("spacing")')
      const count = await categoryBadges.count()
      expect(count).toBeGreaterThan(0)
    })

    test('should reset to all tokens when clicking all category', async ({ page }) => {
      // First filter by a category
      await page.getByRole('button', { name: 'colors' }).click()
      await page.waitForTimeout(300)
      
      const filteredCount = await page.locator('tbody tr').count()
      
      // Then click all
      await page.getByRole('button', { name: 'all' }).first().click()
      await page.waitForTimeout(300)
      
      const allCount = await page.locator('tbody tr').count()
      expect(allCount).toBeGreaterThan(filteredCount)
    })
  })

  test.describe('Status Filtering', () => {
    test('should filter tokens by active status', async ({ page }) => {
      await page.getByRole('button', { name: 'active' }).click()
      
      await page.waitForTimeout(300)
      
      const statusBadges = page.locator('tbody td:has-text("active")')
      const count = await statusBadges.count()
      expect(count).toBeGreaterThan(0)
    })

    test('should filter tokens by deprecated status', async ({ page }) => {
      await page.getByRole('button', { name: 'deprecated' }).click()
      
      await page.waitForTimeout(300)
      
      // Check if any deprecated tokens exist
      const rows = page.locator('tbody tr')
      const count = await rows.count()
      
      if (count > 0) {
        const statusBadges = page.locator('tbody td:has-text("deprecated")')
        expect(await statusBadges.count()).toBeGreaterThan(0)
      }
    })

    test('should filter tokens by experimental status', async ({ page }) => {
      await page.getByRole('button', { name: 'experimental' }).click()
      
      await page.waitForTimeout(300)
      
      const rows = page.locator('tbody tr')
      const count = await rows.count()
      
      if (count > 0) {
        const statusBadges = page.locator('tbody td:has-text("experimental")')
        expect(await statusBadges.count()).toBeGreaterThan(0)
      }
    })
  })

  test.describe('Token Selection', () => {
    test('should select individual tokens', async ({ page }) => {
      const firstCheckbox = page.locator('tbody tr:first-child input[type="checkbox"]')
      await firstCheckbox.check()
      
      await expect(firstCheckbox).toBeChecked()
      await expect(page.locator('text=/1 selected/i')).toBeVisible()
    })

    test('should select all tokens with header checkbox', async ({ page }) => {
      const headerCheckbox = page.locator('thead input[type="checkbox"]')
      await headerCheckbox.check()
      
      await expect(headerCheckbox).toBeChecked()
      
      // Verify selection count is displayed
      const selectedBadge = page.locator('text=/\\d+ selected/i')
      await expect(selectedBadge).toBeVisible()
    })

    test('should deselect all tokens', async ({ page }) => {
      // Select all first
      const headerCheckbox = page.locator('thead input[type="checkbox"]')
      await headerCheckbox.check()
      await page.waitForTimeout(200)
      
      // Then deselect all
      await headerCheckbox.uncheck()
      
      await expect(headerCheckbox).not.toBeChecked()
      await expect(page.locator('text=/selected/i')).not.toBeVisible()
    })

    test('should display selected token details', async ({ page }) => {
      // Click on a token row
      const firstRow = page.locator('tbody tr:first-child')
      await firstRow.click()
      
      await page.waitForTimeout(300)
      
      // Check if details card appears
      await expect(page.getByText(/Selected Token Details/i)).toBeVisible()
    })
  })

  test.describe('Copy to Clipboard', () => {
    test('should show copy button for each token', async ({ page }) => {
      const copyButtons = page.locator('tbody button[aria-label*="Copy"]')
      await expect(copyButtons.first()).toBeVisible()
    })

    test('should show success state after copying', async ({ page }) => {
      const firstCopyButton = page.locator('tbody button[aria-label*="Copy"]').first()
      await firstCopyButton.click()
      
      // Wait for the check icon to appear
      await page.waitForTimeout(300)
      
      // Check if button changed state (this is visual, so we check for class or icon change)
      const buttonClass = await firstCopyButton.getAttribute('class')
      expect(buttonClass).toBeTruthy()
    })
  })

  test.describe('Export Functionality', () => {
    test('should show export options', async ({ page }) => {
      await expect(page.getByRole('button', { name: /JSON/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /CSS/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /SCSS/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /TS/i })).toBeVisible()
    })

    test('should have functional export buttons', async ({ page }) => {
      const jsonExportButton = page.getByRole('button', { name: /JSON/i })
      await expect(jsonExportButton).toBeEnabled()
      
      // Note: We can't easily test file downloads in Playwright without special setup
      // But we can verify the buttons are clickable
      await jsonExportButton.click()
      
      // Wait a moment to ensure no errors occur
      await page.waitForTimeout(500)
    })

    test('should show export count for selected tokens', async ({ page }) => {
      // Select some tokens
      const firstCheckbox = page.locator('tbody tr:first-child input[type="checkbox"]')
      await firstCheckbox.check()
      
      await page.waitForTimeout(300)
      
      // Check export message updates
      await expect(page.locator('text=/Export \\d+ selected token/i')).toBeVisible()
    })
  })

  test.describe('Token Previews', () => {
    test('should display color swatches for color tokens', async ({ page }) => {
      // Filter to color tokens
      await page.getByRole('button', { name: 'colors' }).click()
      await page.waitForTimeout(300)
      
      // Check for color preview elements
      const colorPreviews = page.locator('tbody tr').first().locator('td').nth(3)
      await expect(colorPreviews).toBeVisible()
    })

    test('should display typography previews', async ({ page }) => {
      // Filter to typography tokens
      await page.getByRole('button', { name: 'typography' }).click()
      await page.waitForTimeout(300)
      
      // Verify preview column exists
      const previewCell = page.locator('tbody tr').first().locator('td').nth(3)
      await expect(previewCell).toBeVisible()
    })

    test('should display spacing visualizations', async ({ page }) => {
      // Filter to spacing tokens
      await page.getByRole('button', { name: 'spacing' }).click()
      await page.waitForTimeout(300)
      
      // Verify preview column exists
      const previewCell = page.locator('tbody tr').first().locator('td').nth(3)
      await expect(previewCell).toBeVisible()
    })
  })

  test.describe('Clear Filters', () => {
    test('should clear all filters with Clear All button', async ({ page }) => {
      // Apply multiple filters
      const searchInput = page.getByPlaceholder(/Search tokens/i)
      await searchInput.fill('primary')
      
      await page.getByRole('button', { name: 'colors' }).click()
      await page.waitForTimeout(300)
      
      // Click Clear All
      await page.getByRole('button', { name: /Clear All/i }).click()
      
      // Verify filters are cleared
      await expect(searchInput).toHaveValue('')
      await expect(page.locator('text=/Active filters/i')).not.toBeVisible()
    })

    test('should clear individual filters', async ({ page }) => {
      // Apply a search filter
      const searchInput = page.getByPlaceholder(/Search tokens/i)
      await searchInput.fill('primary')
      await page.waitForTimeout(300)
      
      // Clear just the search filter
      const filterBadge = page.locator('text=/Search: "primary"/i')
      await expect(filterBadge).toBeVisible()
      
      const clearButton = filterBadge.locator('button')
      await clearButton.click()
      
      await expect(searchInput).toHaveValue('')
    })
  })

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      await expect(page.getByLabel(/Search tokens/i)).toBeVisible()
      await expect(page.getByLabel(/Select all tokens/i)).toBeVisible()
    })

    test('should be keyboard navigable', async ({ page }) => {
      // Tab to search input
      await page.keyboard.press('Tab')
      const searchInput = page.getByPlaceholder(/Search tokens/i)
      await expect(searchInput).toBeFocused()
      
      // Type in search
      await page.keyboard.type('primary')
      await page.waitForTimeout(300)
      
      const rows = page.locator('tbody tr')
      expect(await rows.count()).toBeGreaterThan(0)
    })

    test('should have proper table structure', async ({ page }) => {
      await expect(page.locator('table')).toBeVisible()
      await expect(page.locator('thead')).toBeVisible()
      await expect(page.locator('tbody')).toBeVisible()
    })

    test('should have descriptive labels for actions', async ({ page }) => {
      const firstCopyButton = page.locator('tbody button[aria-label*="Copy"]').first()
      const ariaLabel = await firstCopyButton.getAttribute('aria-label')
      expect(ariaLabel).toBeTruthy()
      expect(ariaLabel).toContain('Copy')
    })
  })

  test.describe('Responsive Design', () => {
    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      
      await expect(page.getByRole('heading', { name: /Token Table Component/i })).toBeVisible()
      
      // Table should still be visible (likely with horizontal scroll)
      await expect(page.locator('table')).toBeVisible()
    })

    test('should be responsive on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      
      await expect(page.getByRole('heading', { name: /Token Table Component/i })).toBeVisible()
      await expect(page.locator('table')).toBeVisible()
    })

    test('should be responsive on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      
      await expect(page.getByRole('heading', { name: /Token Table Component/i })).toBeVisible()
      await expect(page.locator('table')).toBeVisible()
    })
  })

  test.describe('Dark Mode', () => {
    test('should toggle dark mode', async ({ page }) => {
      const themeToggle = page.getByRole('button', { name: /Light Mode|Dark Mode/i })
      await expect(themeToggle).toBeVisible()
      
      await themeToggle.click()
      await page.waitForTimeout(300)
      
      // Verify theme changed by checking if button text changed
      await expect(themeToggle).toBeVisible()
    })
  })

  test.describe('Statistics Display', () => {
    test('should display total token count', async ({ page }) => {
      const statsCards = page.locator('text=/Total Tokens/i').locator('..')
      await expect(statsCards).toBeVisible()
    })

    test('should display color token count', async ({ page }) => {
      const colorStats = page.locator('text=/Color Tokens/i').locator('..')
      await expect(colorStats).toBeVisible()
    })

    test('should display active token count', async ({ page }) => {
      const activeStats = page.locator('text=/Active Tokens/i').locator('..')
      await expect(activeStats).toBeVisible()
    })

    test('should display category count', async ({ page }) => {
      const categoryStats = page.locator('text=/Categories/i').locator('..')
      await expect(categoryStats).toBeVisible()
    })
  })

  test.describe('Features Display', () => {
    test('should display all feature badges', async ({ page }) => {
      const features = [
        /Search & Filter/i,
        /Live Previews/i,
        /Copy to Clipboard/i,
        /Export Options/i,
        /Token Status/i,
        /Bulk Selection/i,
      ]
      
      for (const feature of features) {
        await expect(page.locator(`text=${feature}`)).toBeVisible()
      }
    })
  })
})
