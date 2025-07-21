import { test, expect } from '@playwright/test';

test.describe('Home Page - Design System', () => {
  test('should load the design system page successfully', async ({ page }) => {
    await page.goto('/');

    // Check that the page loads with correct title
    await expect(page).toHaveTitle(/AI VideoHub/);

    // Check for the main heading
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('Welcome to AI VideoHub');

    // Check for description text in main content
    const description = page
      .getByRole('main')
      .getByText(/definitive, curated gallery/i);
    await expect(description).toBeVisible();
  });

  test('should have proper responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const main = page.getByRole('main');
    await expect(main).toBeVisible();

    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');

    await expect(main).toBeVisible();
    await expect(heading).toBeVisible();
  });

  test('should display typography correctly', async ({ page }) => {
    await page.goto('/');

    // Check heading has responsive typography styles applied
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();

    // Verify heading content
    await expect(heading).toHaveText('Welcome to AI VideoHub');

    // Check description uses muted foreground color
    const description = page
      .getByRole('main')
      .getByText(/definitive, curated gallery/i);
    await expect(description).toHaveClass(/text-muted-foreground/);
  });
});
