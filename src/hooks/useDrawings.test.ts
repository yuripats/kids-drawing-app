import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDrawings } from './useDrawings';
import * as storage from '../utils/storage';

vi.mock('../utils/storage', () => ({
  get: vi.fn(() => []),
  set: vi.fn(),
  remove: vi.fn(),
  migrate: vi.fn(),
}));

describe('useDrawings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storage.get).mockReturnValue([]);
  });

  test('save() adds a drawing to the list and persists to storage', () => {
    const { result } = renderHook(() => useDrawings());

    act(() => {
      result.current.save('data:image/png;base64,abc123');
    });

    expect(result.current.drawings).toHaveLength(1);
    expect(result.current.drawings[0].dataURL).toBe('data:image/png;base64,abc123');
    expect(storage.set).toHaveBeenCalledTimes(1);
  });

  test('remove() filters out the drawing by id', () => {
    const { result } = renderHook(() => useDrawings());
    let savedId = '';

    act(() => {
      const drawing = result.current.save('data:image/png;base64,remove-me');
      savedId = drawing.id;
    });

    act(() => {
      result.current.remove(savedId);
    });

    expect(result.current.drawings).toHaveLength(0);
  });

  test('clear() empties all drawings and removes from storage', () => {
    const { result } = renderHook(() => useDrawings());

    act(() => {
      result.current.save('data:image/png;base64,one');
    });
    act(() => {
      result.current.save('data:image/png;base64,two');
    });
    act(() => {
      result.current.clear();
    });

    expect(result.current.drawings).toHaveLength(0);
    expect(storage.remove).toHaveBeenCalledWith('drawings:v1');
  });

  test('save() surfaces QuotaExceededError after retry', () => {
    const quotaErr = new DOMException('Storage quota exceeded', 'QuotaExceededError');
    vi.mocked(storage.set).mockImplementation(() => {
      throw quotaErr;
    });

    const { result } = renderHook(() => useDrawings());

    let thrownError: unknown;
    act(() => {
      try {
        result.current.save('data:image/png;base64,too-big');
      } catch (e) {
        thrownError = e;
      }
    });

    expect(thrownError).toBeInstanceOf(DOMException);
    expect((thrownError as DOMException).name).toBe('QuotaExceededError');
    // set is called twice: initial attempt + retry after recompress
    expect(vi.mocked(storage.set).mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});
