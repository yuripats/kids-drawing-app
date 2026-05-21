import { describe, test, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import BubblePopPage from './BubblePopPage';

// Stub the game hook — we only care about the DOM side-effect (style injection)
vi.mock('../../../hooks/useBubblePop', () => ({
  useBubblePop: () => ({
    gameState: {
      bubbles: [],
      score: 0,
      bubblesPopped: 0,
      gameStatus: 'playing' as const,
    },
    popBubble: vi.fn(),
    togglePause: vi.fn(),
    resetGame: vi.fn(),
  }),
}));

afterEach(() => {
  // Clean up the injected style so tests are isolated.
  document.getElementById('bubble-pop-animations')?.remove();
});

describe('BubblePopPage — style-tag deduplication', () => {
  test('remounting does not inject a second #bubble-pop-animations style tag', () => {
    const { unmount: unmount1 } = render(
      <BubblePopPage onNavigateHome={vi.fn()} />
    );
    unmount1();

    const { unmount: unmount2 } = render(
      <BubblePopPage onNavigateHome={vi.fn()} />
    );

    expect(document.querySelectorAll('#bubble-pop-animations').length).toBe(1);

    unmount2();
  });
});
