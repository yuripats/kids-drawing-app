import { test, expect } from '@playwright/test';

/**
 * Regression net: clicking every home tile navigates away from home,
 * and clicking "← Home" returns to the home page.
 * Covers all 13 games. Runs in order to catch navigation regressions in later phases.
 */
const GAME_TILES = [
  'Color Blocks',
  'Sudoku',
  'Tetris',
  'Jelly Volleyball',
  'Snake',
  'Memory Match',
  'Drawing Challenge',
  'Pop Balloons',
  'Simon Says',
  'Bubble Pop',
  'Color Mixer',
  'Math Facts',
  'Shape Sorting',
];

test('click every home tile, assert navigation, return home', async ({ page }) => {
  await page.goto('/');

  // Unique heading only present on the home page
  const homeHeading = page.getByRole('heading', { name: /Fun Games to Play/i });
  await expect(homeHeading).toBeVisible();

  for (const tileName of GAME_TILES) {
    // Click the game tile on the home page
    await page.getByRole('button', { name: new RegExp(tileName, 'i') }).click();

    // Assert we navigated away (home heading no longer visible)
    await expect(homeHeading).not.toBeVisible({ timeout: 5000 });

    // Click the back button (← Home) to return home
    await page.getByRole('button', { name: /home/i }).click();

    // Assert we're back on the home page
    await expect(homeHeading).toBeVisible({ timeout: 5000 });
  }
});
