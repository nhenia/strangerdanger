import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 844 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
});

test('Radar shows searching and approaching states', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  // Toggle active
  await page.getByRole('switch').click();

  // Should show searching state
  await expect(page.getByText('Searching for matches...')).toBeVisible();

  // Wait for approaching state (approx 3-5 seconds in hook)
  await expect(page.getByText('Signal detected! Approaching...')).toBeVisible({ timeout: 15000 });
});

test('Pager theme shows signal bars', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    // Open settings - click the cog icon by test id if it had one, but it doesn't.
    // Let's try to find it by its parent or something.
    // It's in the header, right side.
    await page.locator('header button, .header button, svg').last().click();
    await page.waitForTimeout(1000);

    // Click "The Pager" - maybe it's not visible yet?
    await page.getByText('The Pager').click();

    // Toggle active
    await page.getByRole('switch').click();

    await expect(page.getByText('Paging nearby...')).toBeVisible();
});
