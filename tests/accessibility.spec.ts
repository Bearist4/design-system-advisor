import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test('homepage should be accessible', async ({ page }) => {
    await page.goto('/');
    
    // Wait for redirect to complete (either dashboard or login)
    await page.waitForURL(/.*\/(dashboard|login)/);
    
    // Check for basic accessibility requirements - should have at least one heading
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
    
    // Check for proper heading hierarchy - should have at least one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);
    
    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    for (let i = 0; i < imageCount; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('login page should be accessible', async ({ page }) => {
    await page.goto('/login');
    
    // Check for form labels
    const inputs = page.locator('input');
    const inputCount = await inputs.count();
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const associatedLabel = page.locator(`label[for="${id}"]`);
      
      expect(id && (ariaLabel || await associatedLabel.count() > 0)).toBeTruthy();
    }
  });

  test('dashboard should be accessible', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for redirect to complete (either dashboard or login/onboarding)
    await page.waitForURL(/.*\/(dashboard|login|onboarding)/);
    
    // Check for navigation landmarks
    const nav = page.locator('nav');
    await expect(nav).toHaveCount(1);
    
    // Check for main content area
    const main = page.locator('main, [role="main"]');
    await expect(main).toHaveCount(1);
  });
});
