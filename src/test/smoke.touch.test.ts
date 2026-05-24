import { describe, test, expect } from 'vitest';

describe('touch event smoke test', () => {
  test('touch events can be dispatched in jsdom', () => {
    const evt = new Event('touchstart');
    expect(evt).toBeDefined();
    expect(evt.type).toBe('touchstart');
  });
});
