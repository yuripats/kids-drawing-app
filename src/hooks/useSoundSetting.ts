/**
 * useSoundSetting
 * Reads and writes the kda:settings:soundEnabled flag.
 * Returns the current value and a stable toggle callback.
 */

import { useState, useCallback } from 'react';
import { getSoundEnabled, setSoundEnabled } from '../utils/gameUtils';

export function useSoundSetting() {
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(getSoundEnabled);

  const toggleSound = useCallback(() => {
    setSoundEnabledState(prev => {
      const next = !prev;
      setSoundEnabled(next);
      return next;
    });
  }, []);

  return { soundEnabled, toggleSound };
}
