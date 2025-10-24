import { test, expect } from '@playwright/test';

test.describe('Enhanced Button Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/button-demo');
  });

  test.describe('Size Variants', () => {
    test('should render all size variants correctly', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Extra Small' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Small' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Default' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Large' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Extra Large' })).toBeVisible();
    });

    test('should have correct sizing classes', async ({ page }) => {
      const xsButton = page.getByRole('button', { name: 'Extra Small' });
      const xlButton = page.getByRole('button', { name: 'Extra Large' });

      await expect(xsButton).toHaveClass(/h-7/);
      await expect(xlButton).toHaveClass(/h-12/);
    });
  });

  test.describe('Variant Types', () => {
    test('should render all variant types', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Default' }).first()).toBeVisible();
      await expect(page.getByRole('button', { name: 'Secondary' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Destructive' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Outline' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Ghost' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Link' })).toBeVisible();
    });

    test('should apply correct variant classes', async ({ page }) => {
      const destructiveButton = page.getByRole('button', { name: 'Destructive' });
      await expect(destructiveButton).toHaveClass(/bg-destructive/);
    });
  });

  test.describe('Icon Positioning', () => {
    test('should render buttons with left icons', async ({ page }) => {
      const downloadButton = page.getByRole('button', { name: 'Download' }).first();
      await expect(downloadButton).toBeVisible();
      
      // Check that icon is present
      const icon = downloadButton.locator('svg').first();
      await expect(icon).toBeVisible();
    });

    test('should render buttons with right icons', async ({ page }) => {
      const continueButton = page.getByRole('button', { name: 'Continue' });
      await expect(continueButton).toBeVisible();
      
      const icon = continueButton.locator('svg').first();
      await expect(icon).toBeVisible();
    });

    test('should render icon-only buttons', async ({ page }) => {
      // Icon-only buttons should have aria-label
      const editButton = page.getByRole('button', { name: 'Edit' }).first();
      await expect(editButton).toBeVisible();
      
      // Should only contain icon, not text
      const text = await editButton.textContent();
      expect(text?.trim()).toBe('');
    });

    test('should render icon-only buttons in different sizes', async ({ page }) => {
      const iconButtons = page.getByRole('button', { name: 'Add' });
      const count = await iconButtons.count();
      
      // Should have 5 different sizes (xs, sm, default, lg, xl)
      expect(count).toBeGreaterThanOrEqual(5);
    });
  });

  test.describe('Loading States', () => {
    test('should show loading spinner when isLoading is true', async ({ page }) => {
      const loadButton = page.getByRole('button', { name: 'Click to Load' });
      
      await expect(loadButton).toBeVisible();
      await loadButton.click();
      
      // Should show loading state
      await expect(loadButton).toHaveAttribute('aria-busy', 'true');
      await expect(loadButton).toBeDisabled();
      
      // Should contain spinner
      const spinner = loadButton.locator('svg[role="status"]');
      await expect(spinner).toBeVisible();
    });

    test('should disable button interaction during loading', async ({ page }) => {
      const loadButton = page.getByRole('button', { name: 'Click to Load' });
      
      await loadButton.click();
      
      // Button should be disabled
      await expect(loadButton).toBeDisabled();
      await expect(loadButton).toHaveAttribute('aria-disabled', 'true');
    });

    test('should show custom loading text', async ({ page }) => {
      const processButton = page.getByRole('button', { name: 'Process Data' });
      
      await processButton.click();
      
      // Should show custom loading text
      await expect(page.getByText('Processing...')).toBeVisible();
    });

    test('should work with icon-only buttons', async ({ page }) => {
      const saveButton = page.getByRole('button', { name: 'Save' }).first();
      
      await saveButton.click();
      
      // Should show spinner and be disabled
      await expect(saveButton).toHaveAttribute('aria-busy', 'true');
      await expect(saveButton).toBeDisabled();
    });
  });

  test.describe('Disabled States', () => {
    test('should render disabled buttons correctly', async ({ page }) => {
      const disabledButton = page.getByRole('button', { name: 'Default Disabled' });
      
      await expect(disabledButton).toBeVisible();
      await expect(disabledButton).toBeDisabled();
    });

    test('should have reduced opacity when disabled', async ({ page }) => {
      const disabledButton = page.getByRole('button', { name: 'Default Disabled' });
      
      // Check for disabled styling
      await expect(disabledButton).toHaveClass(/disabled:opacity-50|disabled:bg-primary\/50/);
    });

    test('should not be clickable when disabled', async ({ page }) => {
      const disabledButton = page.getByRole('button', { name: 'Default Disabled' });
      
      // Verify pointer-events-none is applied
      await expect(disabledButton).toHaveClass(/disabled:pointer-events-none/);
    });

    test('should work with icon buttons', async ({ page }) => {
      const disabledIconButton = page.locator('button[aria-label="Edit"]').filter({ hasText: '' }).first();
      
      if (await disabledIconButton.count() > 0) {
        await expect(disabledIconButton).toBeDisabled();
      }
    });
  });

  test.describe('Hover & Focus States', () => {
    test('should show hover effects', async ({ page }) => {
      const button = page.getByRole('button', { name: 'Hover Me' }).first();
      
      await expect(button).toBeVisible();
      
      // Hover over button
      await button.hover();
      
      // Button should have hover classes
      await expect(button).toHaveClass(/hover:bg-primary\/90/);
    });

    test('should show focus ring on keyboard focus', async ({ page }) => {
      const button = page.getByRole('button', { name: 'Hover Me' }).first();
      
      // Focus using keyboard
      await button.focus();
      
      // Should have focus ring classes
      await expect(button).toHaveClass(/focus-visible:ring-2/);
      await expect(button).toBeFocused();
    });

    test('should have scale animation on active state', async ({ page }) => {
      const button = page.getByRole('button', { name: 'Hover Me' }).first();
      
      // Check for active state classes
      await expect(button).toHaveClass(/active:scale-\[0\.98\]/);
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA attributes', async ({ page }) => {
      const button = page.getByRole('button', { name: 'Download' }).first();
      
      // Should be accessible as a button
      await expect(button).toHaveRole('button');
    });

    test('should announce loading state to screen readers', async ({ page }) => {
      const loadButton = page.getByRole('button', { name: 'Click to Load' });
      
      await loadButton.click();
      
      // Should have aria-busy
      await expect(loadButton).toHaveAttribute('aria-busy', 'true');
    });

    test('should announce disabled state to screen readers', async ({ page }) => {
      const disabledButton = page.getByRole('button', { name: 'Default Disabled' });
      
      await expect(disabledButton).toHaveAttribute('aria-disabled', 'true');
    });

    test('icon-only buttons should have aria-label', async ({ page }) => {
      const editButton = page.getByRole('button', { name: 'Edit' }).first();
      
      // Should have aria-label for screen readers
      const ariaLabel = await editButton.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    });

    test('decorative icons should be hidden from screen readers', async ({ page }) => {
      const downloadButton = page.getByRole('button', { name: 'Download' }).first();
      const icon = downloadButton.locator('svg').first();
      
      // Icon should have aria-hidden
      await expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  test.describe('Real-world Patterns', () => {
    test('should render form action buttons', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: 'Submit' });
      const cancelButton = page.getByRole('button', { name: 'Cancel' });
      
      await expect(submitButton).toBeVisible();
      await expect(cancelButton).toBeVisible();
    });

    test('should render CRUD operation buttons', async ({ page }) => {
      const createButton = page.getByRole('button', { name: 'Create New' });
      const editButton = page.getByRole('button', { name: /^Edit$/ }).first();
      const deleteButton = page.getByRole('button', { name: /^Delete$/ }).first();
      
      await expect(createButton).toBeVisible();
      await expect(editButton).toBeVisible();
      await expect(deleteButton).toBeVisible();
    });
  });

  test.describe('Size & Variant Matrix', () => {
    test('should render complete matrix of sizes and variants', async ({ page }) => {
      // Check that table exists
      const table = page.locator('table');
      await expect(table).toBeVisible();
      
      // Should have rows for each size
      const rows = table.locator('tbody tr');
      const rowCount = await rows.count();
      expect(rowCount).toBe(5); // xs, sm, default, lg, xl
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const button = page.getByRole('button', { name: 'Extra Small' });
      await expect(button).toBeVisible();
    });

    test('should be responsive on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      const button = page.getByRole('button', { name: 'Extra Large' });
      await expect(button).toBeVisible();
    });

    test('should be responsive on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      const button = page.getByRole('button', { name: 'Extra Large' });
      await expect(button).toBeVisible();
    });
  });
});
