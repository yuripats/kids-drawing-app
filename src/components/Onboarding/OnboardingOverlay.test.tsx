/**
 * OnboardingOverlay tests (PR-5d)
 *
 * Covers acceptance criteria:
 *  1. Overlay renders when firstRunComplete=false in storage
 *  2. Click through all 4 steps → dismiss sets firstRunComplete=true
 *  3. Overlay NOT in DOM when firstRunComplete=true in storage
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mocks ─────────────────────────────────────────────────────────────────────

const { mockGet, mockSet } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockSet: vi.fn(),
}));

vi.mock('../../utils/storage', () => ({
  get: mockGet,
  set: mockSet,
  remove: vi.fn(),
  migrate: vi.fn(),
}));

// ── SUT import ────────────────────────────────────────────────────────────────

import OnboardingOverlay from './OnboardingOverlay';

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
});

describe('OnboardingOverlay — first-run visibility', () => {
  it('shows the overlay when firstRunComplete=false', () => {
    mockGet.mockReturnValue(false);

    render(<OnboardingOverlay />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does NOT render when firstRunComplete=true', () => {
    mockGet.mockReturnValue(true);

    render(<OnboardingOverlay />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('OnboardingOverlay — step navigation (PR-5d)', () => {
  it('advances through all 4 steps and dismisses on final step', () => {
    mockGet.mockReturnValue(false);

    render(<OnboardingOverlay />);

    // Step 1: shows emoji 🎮 and "Next →" button
    expect(screen.getByText('Pick a game!')).toBeInTheDocument();
    expect(screen.getByText('Next →')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Next →')); // → step 2
    expect(screen.getByText('Tap to play!')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Next →')); // → step 3
    expect(screen.getByText("Today's challenge!")).toBeInTheDocument();

    fireEvent.click(screen.getByText('Next →')); // → step 4
    expect(screen.getByText('Save your art!')).toBeInTheDocument();

    // Last step shows "Got it!" not "Next →"
    expect(screen.queryByText('Next →')).not.toBeInTheDocument();
    expect(screen.getByText('🎉 Got it!')).toBeInTheDocument();
  });

  it('sets firstRunComplete=true and removes overlay on final dismiss', () => {
    mockGet.mockReturnValue(false);

    render(<OnboardingOverlay />);

    // Click through steps 1–3
    fireEvent.click(screen.getByText('Next →'));
    fireEvent.click(screen.getByText('Next →'));
    fireEvent.click(screen.getByText('Next →'));

    // Dismiss on step 4
    fireEvent.click(screen.getByText('🎉 Got it!'));

    // Storage written
    expect(mockSet).toHaveBeenCalledWith('firstRunComplete', true);

    // Overlay gone from DOM
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
