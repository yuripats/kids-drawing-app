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

/**
 * Regression test: JellyVolleyball canvas must fit within a 360px viewport
 * (verifies the touch-coord fix — canvas no longer overflows, so CSS scaling
 * stays ≤1× and raw clientX maps correctly to in-game coords).
 */
test('JellyVolleyball canvas fits within 360px viewport and handles interaction', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');

  await page.getByRole('button', { name: /jelly volleyball/i }).click();
  await expect(page.getByRole('heading', { name: /Fun Games to Play/i })).not.toBeVisible();

  const canvas = page.locator('canvas').first();
  await expect(canvas).toBeVisible();

  // Canvas must not overflow the 360px viewport (key invariant for correct touch coords)
  const box = await canvas.boundingBox();
  expect(box!.width).toBeLessThanOrEqual(361); // +1 for subpixel rounding

  // Click the left quarter of the canvas — exercises the mouse/touch handler
  // without requiring canvas pixel inspection
  await canvas.click({ position: { x: Math.floor(box!.width * 0.25), y: Math.floor(box!.height * 0.75) } });

  // Game still rendering after interaction (no crash from bad coords)
  await expect(canvas).toBeVisible();

  // Return home
  await page.getByRole('button', { name: /home/i }).click();
  await expect(page.getByRole('heading', { name: /Fun Games to Play/i })).toBeVisible();
});

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
