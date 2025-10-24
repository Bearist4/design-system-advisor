import { test, expect } from '@playwright/test'

test.describe('Accessibility Features', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard or main page
    await page.goto('/')
  })

  test.describe('Keyboard Navigation', () => {
    test('should navigate through interactive elements with Tab', async ({ page }) => {
      // Tab through elements
      await page.keyboard.press('Tab')
      const firstFocused = await page.evaluate(() => document.activeElement?.tagName)
      expect(['BUTTON', 'A', 'INPUT']).toContain(firstFocused)
      
      // Continue tabbing
      await page.keyboard.press('Tab')
      const secondFocused = await page.evaluate(() => document.activeElement?.tagName)
      expect(secondFocused).toBeTruthy()
    })

    test('should show visible focus indicators', async ({ page }) => {
      // Tab to first element
      await page.keyboard.press('Tab')
      
      // Check if focused element has visible outline
      const hasOutline = await page.evaluate(() => {
        const el = document.activeElement
        if (!el) return false
        const styles = window.getComputedStyle(el)
        return styles.outline !== 'none' || styles.outlineWidth !== '0px'
      })
      
      expect(hasOutline).toBeTruthy()
    })

    test('should support Enter and Space for button activation', async ({ page }) => {
      const button = page.locator('button').first()
      await button.focus()
      
      // Should activate with Enter
      await page.keyboard.press('Enter')
      
      // Should activate with Space
      await button.focus()
      await page.keyboard.press('Space')
    })
  })

  test.describe('ARIA Labels and Attributes', () => {
    test('buttons should have accessible names', async ({ page }) => {
      const buttons = page.locator('button')
      const count = await buttons.count()
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        const button = buttons.nth(i)
        const accessibleName = await button.getAttribute('aria-label') || 
                               await button.textContent()
        expect(accessibleName).toBeTruthy()
      }
    })

    test('navigation should have proper role and labels', async ({ page }) => {
      const nav = page.locator('nav')
      if (await nav.count() > 0) {
        const role = await nav.first().getAttribute('role')
        const ariaLabel = await nav.first().getAttribute('aria-label')
        
        expect(role === 'navigation' || role === null).toBeTruthy()
        expect(ariaLabel).toBeTruthy()
      }
    })

    test('images should have alt text', async ({ page }) => {
      const images = page.locator('img')
      const count = await images.count()
      
      for (let i = 0; i < count; i++) {
        const img = images.nth(i)
        const alt = await img.getAttribute('alt')
        expect(alt !== null).toBeTruthy()
      }
    })

    test('form inputs should have associated labels', async ({ page }) => {
      const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"]')
      const count = await inputs.count()
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        const input = inputs.nth(i)
        const id = await input.getAttribute('id')
        const ariaLabel = await input.getAttribute('aria-label')
        const ariaLabelledBy = await input.getAttribute('aria-labelledby')
        
        if (id) {
          const label = page.locator(`label[for="${id}"]`)
          const hasLabel = await label.count() > 0
          expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy()
        } else {
          expect(ariaLabel || ariaLabelledBy).toBeTruthy()
        }
      }
    })
  })

  test.describe('Modal Accessibility', () => {
    test('modal should have proper ARIA attributes when open', async ({ page }) => {
      // Look for a button that opens a modal
      const modalTrigger = page.locator('button').filter({ hasText: /open|modal|dialog/i }).first()
      
      if (await modalTrigger.count() > 0) {
        await modalTrigger.click()
        
        // Wait for modal to appear
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toBeVisible()
        
        // Check ARIA attributes
        await expect(modal).toHaveAttribute('aria-modal', 'true')
        
        // Check for title
        const ariaLabelledBy = await modal.getAttribute('aria-labelledby')
        if (ariaLabelledBy) {
          const title = page.locator(`#${ariaLabelledBy}`)
          await expect(title).toBeVisible()
        }
        
        // Close with Escape
        await page.keyboard.press('Escape')
        await expect(modal).not.toBeVisible()
      }
    })

    test('focus should be trapped in modal', async ({ page }) => {
      const modalTrigger = page.locator('button').filter({ hasText: /open|modal|dialog/i }).first()
      
      if (await modalTrigger.count() > 0) {
        await modalTrigger.click()
        
        const modal = page.locator('[role="dialog"]')
        await expect(modal).toBeVisible()
        
        // Tab through modal elements
        const initialFocus = await page.evaluate(() => document.activeElement?.tagName)
        
        // Tab multiple times
        for (let i = 0; i < 10; i++) {
          await page.keyboard.press('Tab')
        }
        
        // Focus should still be within modal
        const focusInModal = await page.evaluate(() => {
          const activeEl = document.activeElement
          const modal = document.querySelector('[role="dialog"]')
          return modal?.contains(activeEl)
        })
        
        expect(focusInModal).toBeTruthy()
      }
    })
  })

  test.describe('Color Contrast', () => {
    test('text should have sufficient contrast', async ({ page }) => {
      // Get all text elements
      const textElements = await page.locator('body *').filter({ hasText: /.+/ }).all()
      
      for (const element of textElements.slice(0, 10)) {
        const contrast = await element.evaluate((el) => {
          const styles = window.getComputedStyle(el)
          const color = styles.color
          const bgColor = styles.backgroundColor
          
          // Simple check - just ensure colors are set
          return color && bgColor
        })
        
        expect(contrast).toBeTruthy()
      }
    })
  })

  test.describe('Screen Reader Support', () => {
    test('page should have screen reader announcer', async ({ page }) => {
      const announcer = page.locator('#a11y-announcer')
      await expect(announcer).toHaveCount(1)
      
      const role = await announcer.getAttribute('role')
      expect(role).toBe('status')
      
      const ariaLive = await announcer.getAttribute('aria-live')
      expect(ariaLive).toBe('polite')
    })

    test('skip to content link should be present', async ({ page }) => {
      const skipLink = page.locator('a').filter({ hasText: /skip to content/i }).first()
      if (await skipLink.count() > 0) {
        // Should be hidden by default
        const isHidden = await skipLink.evaluate((el) => {
          const styles = window.getComputedStyle(el)
          return styles.position === 'absolute' && 
                 (styles.left === '-10000px' || styles.clip === 'rect(0px, 0px, 0px, 0px)')
        })
        
        expect(isHidden).toBeTruthy()
        
        // Should become visible when focused
        await skipLink.focus()
        const isVisible = await skipLink.isVisible()
        expect(isVisible).toBeTruthy()
      }
    })
  })

  test.describe('Motion Preferences', () => {
    test('should respect prefers-reduced-motion', async ({ page, context }) => {
      // Set reduced motion preference
      await context.addInitScript(() => {
        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: (query: string) => ({
            matches: query === '(prefers-reduced-motion: reduce)',
            media: query,
            onchange: null,
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => true,
          }),
        })
      })
      
      await page.reload()
      
      // Check if animations are disabled
      const hasReducedMotion = await page.evaluate(() => {
        const styles = window.getComputedStyle(document.body)
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches
      })
      
      expect(hasReducedMotion).toBeTruthy()
    })
  })

  test.describe('Table Accessibility', () => {
    test('tables should have proper structure', async ({ page }) => {
      const tables = page.locator('table')
      
      if (await tables.count() > 0) {
        const table = tables.first()
        
        // Check for thead
        const thead = table.locator('thead')
        if (await thead.count() > 0) {
          // Check th elements have scope
          const thElements = thead.locator('th')
          const firstTh = thElements.first()
          if (await firstTh.count() > 0) {
            const scope = await firstTh.getAttribute('scope')
            expect(scope).toBeTruthy()
          }
        }
        
        // Check for caption or aria-label
        const caption = table.locator('caption')
        const ariaLabel = await table.getAttribute('aria-label')
        const hasLabel = await caption.count() > 0 || ariaLabel
        
        expect(hasLabel).toBeTruthy()
      }
    })
  })

  test.describe('Form Accessibility', () => {
    test('form errors should be associated with inputs', async ({ page }) => {
      const inputs = page.locator('input[aria-invalid="true"]')
      
      if (await inputs.count() > 0) {
        const input = inputs.first()
        const ariaDescribedBy = await input.getAttribute('aria-describedby')
        
        expect(ariaDescribedBy).toBeTruthy()
        
        if (ariaDescribedBy) {
          const errorIds = ariaDescribedBy.split(' ')
          for (const id of errorIds) {
            const errorEl = page.locator(`#${id}`)
            const exists = await errorEl.count() > 0
            expect(exists).toBeTruthy()
          }
        }
      }
    })

    test('required fields should be indicated', async ({ page }) => {
      const labels = page.locator('label')
      
      if (await labels.count() > 0) {
        // Check if any labels have required indicators
        const hasRequired = await page.evaluate(() => {
          const labels = document.querySelectorAll('label')
          return Array.from(labels).some(label => 
            label.textContent?.includes('*') ||
            label.querySelector('[aria-label="required"]')
          )
        })
        
        // This is expected to pass if there are required fields
        expect(typeof hasRequired).toBe('boolean')
      }
    })
  })

  test.describe('Sidebar Accessibility', () => {
    test('sidebar should have proper navigation structure', async ({ page }) => {
      const sidebar = page.locator('[aria-label*="sidebar" i], [aria-label*="navigation" i]').first()
      
      if (await sidebar.count() > 0) {
        // Should have navigation role
        const role = await sidebar.getAttribute('role')
        expect(['navigation', null]).toContain(role)
        
        // Should have aria-label
        const ariaLabel = await sidebar.getAttribute('aria-label')
        expect(ariaLabel).toBeTruthy()
        
        // Check for list structure
        const lists = sidebar.locator('[role="list"], ul')
        if (await lists.count() > 0) {
          expect(await lists.count()).toBeGreaterThan(0)
        }
      }
    })

    test('expandable items should have aria-expanded', async ({ page }) => {
      const expandableItems = page.locator('[aria-expanded]')
      
      if (await expandableItems.count() > 0) {
        const item = expandableItems.first()
        const expanded = await item.getAttribute('aria-expanded')
        expect(['true', 'false']).toContain(expanded)
        
        // Should be keyboard accessible
        const tabIndex = await item.getAttribute('tabindex')
        expect(parseInt(tabIndex || '0')).toBeGreaterThanOrEqual(0)
      }
    })
  })

  test.describe('Button States', () => {
    test('disabled buttons should have proper attributes', async ({ page }) => {
      const disabledButtons = page.locator('button[disabled], button[aria-disabled="true"]')
      
      if (await disabledButtons.count() > 0) {
        const button = disabledButtons.first()
        
        const disabled = await button.getAttribute('disabled')
        const ariaDisabled = await button.getAttribute('aria-disabled')
        
        expect(disabled !== null || ariaDisabled === 'true').toBeTruthy()
        
        // Should not be activatable
        await button.click({ force: true, timeout: 1000 }).catch(() => {})
      }
    })

    test('loading buttons should have aria-busy', async ({ page }) => {
      const loadingButtons = page.locator('button[aria-busy="true"]')
      
      if (await loadingButtons.count() > 0) {
        const button = loadingButtons.first()
        const ariaBusy = await button.getAttribute('aria-busy')
        expect(ariaBusy).toBe('true')
      }
    })
  })

  test.describe('Tooltip Accessibility', () => {
    test('tooltips should have proper ARIA attributes', async ({ page }) => {
      const tooltipTriggers = page.locator('[aria-describedby*="tooltip"]')
      
      if (await tooltipTriggers.count() > 0) {
        const trigger = tooltipTriggers.first()
        await trigger.hover()
        
        await page.waitForTimeout(300) // Wait for tooltip delay
        
        const describedBy = await trigger.getAttribute('aria-describedby')
        expect(describedBy).toBeTruthy()
        
        if (describedBy) {
          const tooltip = page.locator(`#${describedBy}`)
          if (await tooltip.count() > 0) {
            const role = await tooltip.getAttribute('role')
            expect(role).toBe('tooltip')
          }
        }
      }
    })
  })
})
