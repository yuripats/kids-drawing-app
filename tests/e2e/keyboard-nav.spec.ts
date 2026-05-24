import { test, expect } from '@playwright/test';

// Pre-dismiss first-run onboarding overlay so it doesn't block keyboard nav
test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem('kda:firstRunComplete', 'true');
  });
});

test('home page tiles are keyboard navigable and focus outline is visible', async ({ page }) => {
  await page.goto('/');

  // Verify home heading is visible (no overlay blocking)
  await expect(page.getByRole('heading', { name: /Fun Games to Play/i })).toBeVisible();

  // Focus first game tile (Color Blocks) — keyboard focus triggers :focus-visible
  const colorBlocksTile = page.getByRole('button', { name: 'Color Blocks' });
  await colorBlocksTile.focus();

  // Assert focus outline is applied (Tailwind preflight override restored by PR-6a)
  const outlineWidth = await colorBlocksTile.evaluate((el) =>
    window.getComputedStyle(el).outlineWidth
  );
  expect(outlineWidth).not.toBe('0px');

  // Press Enter to navigate to the game
  await colorBlocksTile.press('Enter');

  // Home heading disappears = game opened successfully
  await expect(page.getByRole('heading', { name: /Fun Games to Play/i })).not.toBeVisible({ timeout: 3000 });
});
