import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useDailyChallenge } from './useDailyChallenge';
import * as storage from '../utils/storage';

// Fixed reference date: 2024-06-15 (Saturday)
const TODAY = new Date('2024-06-15T10:00:00Z');
const TODAY_ISO = '2024-06-15';
const YESTERDAY_ISO = '2024-06-14';
const FOUR_DAYS_AGO_ISO = '2024-06-11';

describe('useDailyChallenge — streak logic', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(TODAY);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('first-ever load: lastDate=null → streak becomes 1', () => {
    // Storage is empty (never visited)
    const { result } = renderHook(() => useDailyChallenge());

    expect(result.current.streak).toBe(1);
    // Verify storage was written
    expect(storage.get('daily:lastDate', null)).toBe(TODAY_ISO);
    expect(storage.get('daily:streak', 0)).toBe(1);
  });

  it('same-day reload: lastDate=today → streak unchanged', () => {
    storage.set('daily:lastDate', TODAY_ISO);
    storage.set('daily:streak', 5);

    const { result } = renderHook(() => useDailyChallenge());

    expect(result.current.streak).toBe(5);
    // Storage should not have been touched (same values)
    expect(storage.get('daily:streak', 0)).toBe(5);
  });

  it('next-day load: lastDate=yesterday → streak increments by 1', () => {
    storage.set('daily:lastDate', YESTERDAY_ISO);
    storage.set('daily:streak', 3);

    const { result } = renderHook(() => useDailyChallenge());

    expect(result.current.streak).toBe(4);
    expect(storage.get('daily:lastDate', null)).toBe(TODAY_ISO);
    expect(storage.get('daily:streak', 0)).toBe(4);
  });

  it('3-day gap: lastDate=4 days ago → streak resets to 1', () => {
    storage.set('daily:lastDate', FOUR_DAYS_AGO_ISO);
    storage.set('daily:streak', 10);

    const { result } = renderHook(() => useDailyChallenge());

    expect(result.current.streak).toBe(1);
    expect(storage.get('daily:lastDate', null)).toBe(TODAY_ISO);
    expect(storage.get('daily:streak', 0)).toBe(1);
  });

  it('returns a valid daily prompt (deterministic for same day)', () => {
    const { result: r1 } = renderHook(() => useDailyChallenge());
    const { result: r2 } = renderHook(() => useDailyChallenge());

    expect(r1.current.dailyPrompt).toBeDefined();
    expect(r1.current.dailyPrompt.id).toBe(r2.current.dailyPrompt.id);
    expect(r1.current.dailyPrompt.text).toBeTruthy();
  });

  it('daily prompt is a valid Prompt on any day', () => {
    vi.setSystemTime(new Date('2024-06-30T12:00:00Z'));
    const { result } = renderHook(() => useDailyChallenge());

    expect(result.current.dailyPrompt).toBeDefined();
    expect(typeof result.current.dailyPrompt.id).toBe('string');
    expect(typeof result.current.dailyPrompt.text).toBe('string');
    expect(typeof result.current.dailyPrompt.emoji).toBe('string');
  });
});
