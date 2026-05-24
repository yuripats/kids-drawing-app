/**
 * Daily Drawing Challenge hook
 * Tracks a per-day streak and picks a deterministic daily prompt.
 */

import { useEffect, useState } from 'react';
import * as storage from '../utils/storage';
import { prompts } from '../components/Games/DrawingChallenge/prompts';
import type { Prompt } from '../components/Games/DrawingChallenge/types';

const LAST_DATE_KEY = 'daily:lastDate';
const STREAK_KEY = 'daily:streak';

/** Today's date as YYYY-MM-DD (UTC midnight rollover). */
export function todayISO(): string {
  const d = new Date();
  return [
    d.getUTCFullYear(),
    String(d.getUTCMonth() + 1).padStart(2, '0'),
    String(d.getUTCDate()).padStart(2, '0'),
  ].join('-');
}

/** Yesterday's date as YYYY-MM-DD (UTC). */
export function yesterdayISO(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return [
    d.getUTCFullYear(),
    String(d.getUTCMonth() + 1).padStart(2, '0'),
    String(d.getUTCDate()).padStart(2, '0'),
  ].join('-');
}

/**
 * Deterministically select today's prompt based on days-since-epoch.
 * The same kid sees the same prompt on the same calendar day, regardless
 * of how many times they reload.
 */
export function getDailyPrompt(): Prompt {
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return prompts[dayIndex % prompts.length];
}

export interface DailyState {
  dailyPrompt: Prompt;
  streak: number;
}

/**
 * Manages the daily streak counter.
 *
 * Streak rules (evaluated once on mount):
 *  - lastDate === today           → no change (already counted today)
 *  - lastDate === yesterday       → streak + 1 (consecutive day)
 *  - lastDate === null or older   → streak resets to 1
 */
export function useDailyChallenge(): DailyState {
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    const today = todayISO();
    const lastDate = storage.get<string | null>(LAST_DATE_KEY, null);
    const savedStreak = storage.get<number>(STREAK_KEY, 0);

    if (lastDate === today) {
      // Already visited today — show current streak without touching storage
      setStreak(savedStreak);
    } else if (lastDate === yesterdayISO()) {
      // Came back the next day — extend the streak
      const next = savedStreak + 1;
      storage.set(LAST_DATE_KEY, today);
      storage.set(STREAK_KEY, next);
      setStreak(next);
    } else {
      // First visit ever, or a gap longer than one day — start fresh
      storage.set(LAST_DATE_KEY, today);
      storage.set(STREAK_KEY, 1);
      setStreak(1);
    }
  }, []);

  return {
    dailyPrompt: getDailyPrompt(),
    streak,
  };
}
