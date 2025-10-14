import { test, expect } from '@playwright/test';

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