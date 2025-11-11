/**
 * Color Mixer Game Types
 */

export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export interface Challenge {
  name: string;
  target: ColorRGB;
  hint: string;
}

export interface ColorMixerState {
  currentMix: ColorRGB;
  challenge: Challenge | null;
  score: number;
  completedChallenges: number;
}
