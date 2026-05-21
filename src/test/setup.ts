import '@testing-library/jest-dom/vitest';

// Hand-rolled localStorage stub — jsdom omits it; required by ShapeSorting (11) + ColorBlocks (3)
const _store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string): string | null => _store[key] ?? null,
  setItem: (key: string, value: string): void => { _store[key] = String(value); },
  removeItem: (key: string): void => { delete _store[key]; },
  clear: (): void => { Object.keys(_store).forEach(k => delete _store[k]); },
  key: (index: number): string | null => Object.keys(_store)[index] ?? null,
  get length(): number { return Object.keys(_store).length; },
};
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true });
