import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as storage from './storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('round-trips a value through get / set / remove', () => {
    storage.set('test:obj', { score: 42, name: 'alice' });
    expect(storage.get('test:obj', null)).toEqual({ score: 42, name: 'alice' });

    storage.set('test:num', 7);
    expect(storage.get('test:num', 0)).toBe(7);

    storage.remove('test:num');
    expect(storage.get('test:num', 0)).toBe(0);
  });

  it('returns fallback when key is absent', () => {
    expect(storage.get('no:such:key', 99)).toBe(99);
    expect(storage.get('missing', null)).toBeNull();
  });

  it('returns fallback on JSON parse error (legacy raw-string values)', () => {
    // Simulate a legacy value stored without JSON.stringify
    localStorage.setItem('kda:raw:key', 'not-valid-json-{');
    expect(storage.get('raw:key', 'default')).toBe('default');
  });

  it('rethrows QuotaExceededError from setItem', () => {
    // Use a plain Error so Vitest's toThrow matcher accepts it as an Error instance.
    // The real browser throws DOMException; what matters is that set() does not swallow it.
    const quotaError = new Error('QuotaExceededError');
    // Spy on the actual localStorage instance (the test polyfill is a plain object,
    // not a Storage subclass, so Storage.prototype is not in its chain).
    const spy = vi.spyOn(localStorage, 'setItem').mockImplementationOnce(() => {
      throw quotaError;
    });
    expect(() => storage.set('test:key', 'value')).toThrow('QuotaExceededError');
    spy.mockRestore();
  });

  it('migrate() copies legacy un-prefixed keys to kda: namespace', () => {
    localStorage.setItem('snakeHighScore', '150');
    localStorage.setItem('colorBlocksHighScore', '999');
    storage.migrate();
    expect(localStorage.getItem('kda:snakeHighScore')).toBe('150');
    expect(localStorage.getItem('kda:colorBlocksHighScore')).toBe('999');
  });

  it('migrate() is idempotent — second call is a no-op', () => {
    localStorage.setItem('legacyKey', 'hello');
    storage.migrate();
    expect(localStorage.getItem('kda:legacyKey')).toBe('hello');

    // Remove the namespaced copy; a second migrate() must not recreate it
    localStorage.removeItem('kda:legacyKey');
    storage.migrate(); // sentinel is set — should be a no-op
    expect(localStorage.getItem('kda:legacyKey')).toBeNull();
  });

  it('migrate() does not overwrite an existing namespaced value', () => {
    localStorage.setItem('kda:snakeHighScore', '200'); // already correct namespace
    localStorage.setItem('snakeHighScore', '100');     // stale legacy copy
    storage.migrate();
    // The existing namespaced value (200) must win over the legacy value (100)
    expect(localStorage.getItem('kda:snakeHighScore')).toBe('200');
  });
});
