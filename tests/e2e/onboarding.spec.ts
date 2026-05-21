import { test, expect } from '@playwright/test';

// NO beforeEach seed — this file specifically tests fresh-context first-load behaviour.

test('onboarding overlay appears on first load and can be dismissed', async ({ page }) => {
  await page.goto('/');

  // Overlay should be visible on a fresh context (no kda:firstRunComplete in storage)
  const overlay = page.getByRole('dialog', { name: 'Welcome to Kids Drawing App' });
  await expect(overlay).toBeVisible();

  // Step 1: "Pick a game!"
  await expect(overlay.getByRole('heading', { name: 'Pick a game!' })).toBeVisible();

  // Advance through steps 2 and 3 via "Next →"
  await overlay.getByRole('button', { name: 'Next →' }).click();
  await expect(overlay.getByRole('heading', { name: 'Tap to play!' })).toBeVisible();

  await overlay.getByRole('button', { name: 'Next →' }).click();
  await expect(overlay.getByRole('heading', { name: "Today's challenge!" })).toBeVisible();

  await overlay.getByRole('button', { name: 'Next →' }).click();
  await expect(overlay.getByRole('heading', { name: 'Save your art!' })).toBeVisible();

  // Final step — "Got it!" button dismisses the overlay
  await overlay.getByRole('button', { name: /Got it/i }).click();

  // Overlay must be gone
  await expect(overlay).not.toBeVisible({ timeout: 2000 });

  // Home screen should now be accessible
  await expect(page.getByRole('heading', { name: /Fun Games to Play/i })).toBeVisible();

  // localStorage should now have the completion flag set
  const flag = await page.evaluate(() => localStorage.getItem('kda:firstRunComplete'));
  expect(flag).not.toBeNull();
});
