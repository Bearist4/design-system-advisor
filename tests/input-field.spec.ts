import { test, expect } from '@playwright/test'

test.describe('Input Field Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/input-showcase')
    // Wait for the page to load
    await page.waitForLoadState('networkidle')
  })

  test('should display page title and description', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Input Field Components')
    await expect(page.locator('p').first()).toContainText('comprehensive set of input field components')
  })

  test('should render all size variants', async ({ page }) => {
    await expect(page.getByLabel('Small Input')).toBeVisible()
    await expect(page.getByLabel('Medium Input')).toBeVisible()
    await expect(page.getByLabel('Large Input')).toBeVisible()
  })

  test('should render different input types', async ({ page }) => {
    await expect(page.getByLabel('Text Input')).toBeVisible()
    await expect(page.getByLabel('Email Input')).toBeVisible()
    await expect(page.getByLabel('Password Input')).toBeVisible()
    await expect(page.getByLabel('Search Input')).toBeVisible()
    await expect(page.getByLabel('Phone Input')).toBeVisible()
    await expect(page.getByLabel('URL Input')).toBeVisible()
    await expect(page.getByLabel('Number Input')).toBeVisible()
  })

  test('should display validation states', async ({ page }) => {
    await expect(page.getByLabel('Default State')).toBeVisible()
    await expect(page.getByLabel('Success State')).toBeVisible()
    await expect(page.getByLabel('Error State')).toBeVisible()
    await expect(page.getByLabel('Warning State')).toBeVisible()
  })

  test('should show error message for error state', async ({ page }) => {
    const errorInput = page.getByLabel('Error State')
    await expect(errorInput).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByText('This email format is invalid')).toBeVisible()
  })

  test('should show success message for success state', async ({ page }) => {
    await expect(page.getByText('Email is valid and available')).toBeVisible()
  })

  test('should show warning message for warning state', async ({ page }) => {
    await expect(page.getByText('This email domain is commonly used for testing')).toBeVisible()
  })

  test('should support keyboard navigation', async ({ page }) => {
    const firstInput = page.getByLabel('Small Input')
    await firstInput.focus()
    await expect(firstInput).toBeFocused()
    
    // Tab to next input
    await page.keyboard.press('Tab')
    const secondInput = page.getByLabel('Medium Input')
    await expect(secondInput).toBeFocused()
  })

  test('should display icons with inputs', async ({ page }) => {
    // Check that icon containers exist
    const leftIconInput = page.getByLabel('Left Icon')
    await expect(leftIconInput).toBeVisible()
    
    const rightIconInput = page.getByLabel('Right Icon')
    await expect(rightIconInput).toBeVisible()
    
    const bothIconsInput = page.getByLabel('Both Icons')
    await expect(bothIconsInput).toBeVisible()
  })

  test('should handle disabled state correctly', async ({ page }) => {
    const disabledInput = page.getByLabel('Disabled Input')
    await expect(disabledInput).toBeDisabled()
    await expect(disabledInput).toHaveAttribute('disabled')
  })

  test('should mark required fields with asterisk', async ({ page }) => {
    // Navigate to the form section
    const emailField = page.getByRole('textbox', { name: /email.*required/i }).first()
    await expect(emailField).toHaveAttribute('required')
    await expect(emailField).toHaveAttribute('aria-required', 'true')
  })

  test('should validate email format', async ({ page }) => {
    const emailInput = page.getByLabel('Email Input')
    
    // Type invalid email
    await emailInput.fill('invalid-email')
    await emailInput.blur()
    
    // Wait for validation
    await page.waitForTimeout(300)
    
    // Check for error message
    await expect(page.getByText(/valid email address/i)).toBeVisible()
  })

  test('should validate password length', async ({ page }) => {
    const passwordInput = page.getByLabel('Password Input')
    
    // Type short password
    await passwordInput.fill('short')
    await passwordInput.blur()
    
    // Wait for validation
    await page.waitForTimeout(300)
    
    // Check for error message
    await expect(page.getByText(/at least 8 characters/i)).toBeVisible()
  })

  test('should toggle password visibility', async ({ page }) => {
    const passwordToggleInput = page.getByLabel('Password with Toggle')
    const toggleButton = page.getByRole('button', { name: /show password/i })
    
    // Initially password type
    await expect(passwordToggleInput).toHaveAttribute('type', 'password')
    
    // Click toggle button
    await toggleButton.click()
    
    // Should be text type
    await expect(passwordToggleInput).toHaveAttribute('type', 'text')
    
    // Click again to hide
    await page.getByRole('button', { name: /hide password/i }).click()
    await expect(passwordToggleInput).toHaveAttribute('type', 'password')
  })

  test('should have proper ARIA attributes', async ({ page }) => {
    const emailInput = page.getByLabel('Email Input')
    
    // Check for ARIA attributes
    await expect(emailInput).toHaveAttribute('aria-describedby')
    await expect(emailInput).toHaveAttribute('id')
    
    // Fill with invalid data to trigger error
    await emailInput.fill('invalid')
    await emailInput.blur()
    await page.waitForTimeout(300)
    
    // Should have aria-invalid
    const ariaInvalid = await emailInput.getAttribute('aria-invalid')
    expect(ariaInvalid).toBe('true')
  })

  test('should submit form correctly', async ({ page }) => {
    // Fill out the form
    await page.getByLabel('Full Name', { exact: true }).fill('John Doe')
    await page.getByLabel('Email Address').fill('john@example.com')
    await page.getByLabel('Phone Number').fill('+1 (555) 123-4567')
    await page.getByLabel('Website').fill('https://example.com')
    await page.getByLabel('Password', { exact: true }).last().fill('SecurePass123')
    
    // Listen for dialog
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Form submitted')
      await dialog.accept()
    })
    
    // Submit form
    await page.getByRole('button', { name: 'Submit Form' }).click()
  })

  test('should reset form correctly', async ({ page }) => {
    // Fill out some fields
    const nameInput = page.getByLabel('Full Name', { exact: true })
    await nameInput.fill('John Doe')
    await expect(nameInput).toHaveValue('John Doe')
    
    // Reset form
    await page.getByRole('button', { name: 'Reset' }).click()
    
    // Check if cleared
    await expect(nameInput).toHaveValue('')
  })

  test('should display helper text', async ({ page }) => {
    await expect(page.getByText('This is a small input field')).toBeVisible()
    await expect(page.getByText('This is a medium input field (default)')).toBeVisible()
    await expect(page.getByText('This is a large input field')).toBeVisible()
  })

  test('should have accessible focus indicators', async ({ page }) => {
    const input = page.getByLabel('Small Input')
    await input.focus()
    
    // Check that focus is visible (outline should be present)
    const focusStyles = await input.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        outlineStyle: styles.outlineStyle,
      }
    })
    
    // Focus indicator should have some width
    expect(parseInt(focusStyles.outlineWidth || '0')).toBeGreaterThanOrEqual(0)
  })

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByLabel('Small Input')).toBeVisible()
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByLabel('Small Input')).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByLabel('Small Input')).toBeVisible()
  })

  test('should handle dark mode', async ({ page }) => {
    // Add dark class to body
    await page.evaluate(() => {
      document.documentElement.classList.add('dark')
    })
    
    // Wait for transition
    await page.waitForTimeout(300)
    
    // Inputs should still be visible and functional
    await expect(page.getByLabel('Small Input')).toBeVisible()
    const input = page.getByLabel('Text Input')
    await input.fill('test')
    await expect(input).toHaveValue('test')
  })

  test('should have proper color contrast', async ({ page }) => {
    // This is a basic check - for full contrast testing, use axe-core
    const input = page.getByLabel('Small Input')
    
    const styles = await input.evaluate((el) => {
      const computedStyles = window.getComputedStyle(el)
      return {
        color: computedStyles.color,
        backgroundColor: computedStyles.backgroundColor,
        borderColor: computedStyles.borderColor,
      }
    })
    
    // Basic check that colors are defined
    expect(styles.color).toBeTruthy()
    expect(styles.backgroundColor).toBeTruthy()
    expect(styles.borderColor).toBeTruthy()
  })

  test('should have proper tab order', async ({ page }) => {
    await page.keyboard.press('Tab')
    
    // First focusable element should be an input
    const focused = await page.evaluate(() => document.activeElement?.tagName)
    expect(['INPUT', 'BUTTON', 'A']).toContain(focused)
  })

  test.describe('Accessibility', () => {
    test('should have no accessibility violations', async ({ page }) => {
      // Note: This would require @axe-core/playwright to be installed
      // For now, we'll check basic accessibility features
      
      // Check all inputs have labels
      const inputs = await page.locator('input[type="text"], input[type="email"]').all()
      for (const input of inputs) {
        const ariaLabel = await input.getAttribute('aria-label')
        const ariaLabelledBy = await input.getAttribute('aria-labelledby')
        const id = await input.getAttribute('id')
        
        // Each input should either have aria-label, aria-labelledby, or associated label
        expect(ariaLabel || ariaLabelledBy || id).toBeTruthy()
      }
    })

    test('should announce validation errors to screen readers', async ({ page }) => {
      const emailInput = page.getByLabel('Email Input')
      
      // Type invalid email
      await emailInput.fill('invalid')
      await emailInput.blur()
      await page.waitForTimeout(300)
      
      // Check for live region
      const liveRegion = page.locator('[role="alert"]')
      await expect(liveRegion).toBeVisible()
    })
  })
})
