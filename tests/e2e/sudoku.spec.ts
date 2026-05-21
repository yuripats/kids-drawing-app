import { test, expect } from '@playwright/test';

// Pre-dismiss the first-run onboarding overlay (PR-5d) before React boots,
// so aria-modal does not hide page content from Playwright's a11y tree.
test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem('kda:firstRunComplete', 'true');
  });
});

test('navigate to Sudoku and make a move', async ({ page }) => {
  await page.goto('/');

  // Click the Sudoku button on the home page
  await page.getByRole('button', { name: /sudoku/i }).click();

  // Board renders 81 cells (buttons within grid). We use aria-label contains 'editable' to ensure a playable cell.
  const editableCells = page.locator('button[aria-label*="editable"]');
  await expect(editableCells.first()).toBeVisible();

  // Select first editable cell
  const cell = editableCells.first();
  await cell.click();

  // Click keypad number 1
  await page.getByRole('button', { name: /^1$/ }).click();

  // Expect the cell to show 1
  await expect(cell).toHaveText('1');
});