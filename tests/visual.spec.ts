import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('homepage visual comparison', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('login page visual comparison', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('login-page.png');
  });

  test('dashboard visual comparison', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('dashboard.png');
  });

  test('upload page visual comparison', async ({ page }) => {
    await page.goto('/upload');
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('upload-page.png');
  });

  test('component visual tests', async ({ page }) => {
    await page.goto('/');
    
    // Test button components
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    if (buttonCount > 0) {
      await expect(buttons.first()).toHaveScreenshot('button-component.png');
    }
    
    // Test card components
    const cards = page.locator('[class*="card"]');
    const cardCount = await cards.count();
    if (cardCount > 0) {
      await expect(cards.first()).toHaveScreenshot('card-component.png');
    }
  });
});
