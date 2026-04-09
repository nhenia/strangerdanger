import { test, expect } from '@playwright/test';

test('app loads and shows title', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('PERMISSION')).toBeVisible();
  await page.screenshot({ path: 'screenshots/home.png' });
});

test('can toggle theme', async ({ page }) => {
  await page.goto('/');

  // Open settings
  await page.locator('svg').first().click(); // Settings icon

  // Check if theme buttons are visible
  await expect(page.getByText('Glass')).toBeVisible();
  await expect(page.getByText('Vapor')).toBeVisible();
  await expect(page.getByText('Retro')).toBeVisible();

  // Click Vapor theme
  await page.getByText('Vapor').click();
  await page.screenshot({ path: 'screenshots/theme-vapor.png' });
});
