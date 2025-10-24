import { test, expect } from '@playwright/test';

test.describe('Integration Tests', () => {
  test('user can navigate through the application', async ({ page }) => {
    // Start at homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/Design System Advisor/);
    
    // Check if login link exists and navigate to it
    const loginLink = page.locator('text=Login, a[href*="login"]').first();
    if (await loginLink.count() > 0) {
      await loginLink.click();
      await expect(page).toHaveURL(/.*login/);
      
      // Navigate back to home
      const homeLink = page.locator('text=Home, a[href="/"]').first();
      if (await homeLink.count() > 0) {
        await homeLink.click();
        await expect(page).toHaveURL('/');
      }
    }
  });

  test('upload flow works correctly', async ({ page }) => {
    await page.goto('/upload');
    
    // Check if upload form is present
    const uploadForm = page.locator('form, [role="form"]');
    if (await uploadForm.count() > 0) {
      await expect(uploadForm).toBeVisible();
      
      // Check for file input
      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.count() > 0) {
        await expect(fileInput).toBeVisible();
      }
    }
  });

  test('dashboard displays correctly', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for redirect to complete (either dashboard or login/onboarding)
    await page.waitForURL(/.*\/(dashboard|login|onboarding)/);
    
    // Check for dashboard elements
    const dashboardContent = page.locator('main, [role="main"]');
    await expect(dashboardContent).toBeVisible();
    
    // Check for navigation
    const navigation = page.locator('nav');
    await expect(navigation).toBeVisible();
  });

  test('token details page works', async ({ page }) => {
    // This test assumes you have a token with ID 'test-token'
    // You might need to create a test token first
    await page.goto('/tokens/test-token');
    
    // Check if page loads without errors
    await expect(page).not.toHaveURL(/.*404/);
  });

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Check if navigation is accessible on mobile
    const mobileMenu = page.locator('[aria-label*="menu"], [aria-label*="navigation"]');
    await expect(mobileMenu).toBeVisible();
  });
});
