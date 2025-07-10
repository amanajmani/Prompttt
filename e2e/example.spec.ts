import { test, expect } from '@playwright/test'

test.describe('PROMPTTT Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has correct title and heading', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/PROMPTTT/)
    
    // Check main heading
    await expect(page.getByRole('heading', { name: 'PROMPTTT' })).toBeVisible()
  })

  test('theme toggle works correctly', async ({ page }) => {
    // Find theme toggle buttons
    const lightButton = page.getByRole('button', { name: /switch to light theme/i })
    const darkButton = page.getByRole('button', { name: /switch to dark theme/i })
    
    // Test switching to light theme
    await lightButton.click()
    await expect(page.locator('html')).toHaveClass(/light/)
    
    // Test switching back to dark theme
    await darkButton.click()
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check that content is still visible and properly laid out
    await expect(page.getByRole('heading', { name: 'PROMPTTT' })).toBeVisible()
    await expect(page.getByText('Design System Preview')).toBeVisible()
    
    // Check that mobile-specific elements are visible
    await expect(page.getByText('Touch-Friendly')).toBeVisible()
  })

  test('responsive design works on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    
    // Check layout adapts to tablet size
    await expect(page.getByRole('heading', { name: 'PROMPTTT' })).toBeVisible()
    await expect(page.getByText('Responsive Typography System')).toBeVisible()
  })

  test('responsive design works on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1024, height: 768 })
    
    // Check desktop layout
    await expect(page.getByRole('heading', { name: 'PROMPTTT' })).toBeVisible()
    await expect(page.getByText('Current Theme Colors')).toBeVisible()
  })

  test('accessibility - keyboard navigation works', async ({ page }) => {
    // Test keyboard navigation through theme toggle
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Should be able to activate theme toggle with keyboard
    await page.keyboard.press('Enter')
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('color scheme preference is respected', async ({ page, browserName }) => {
    // Skip this test for webkit as it doesn't support color-scheme emulation
    test.skip(browserName === 'webkit', 'WebKit does not support color-scheme emulation')
    
    // Test dark mode preference
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.reload()
    await expect(page.locator('html')).toHaveClass(/dark/)
    
    // Test light mode preference
    await page.emulateMedia({ colorScheme: 'light' })
    await page.reload()
    await expect(page.locator('html')).toHaveClass(/light/)
  })

  test('milestone completion status is displayed', async ({ page }) => {
    // Check that milestone status is shown
    await expect(page.getByText('Milestone 4: Mobile-First Responsive Foundation - COMPLETE')).toBeVisible()
    await expect(page.getByText('Perfect responsive design that works beautifully on every device')).toBeVisible()
  })
})