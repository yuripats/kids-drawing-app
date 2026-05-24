/**
 * OnboardingOverlay — 4-step pictographic first-run walkthrough.
 *
 * Shown once on first app launch; dismissed by clicking through all steps.
 * Visibility is gated on kda:firstRunComplete in localStorage.
 * Large emoji + minimal text so pre-readers can follow along.
 */

import React, { useState } from 'react';
import * as storage from '../../utils/storage';

const STORAGE_KEY = 'firstRunComplete';

interface Step {
  emoji: string;
  title: string;
  desc: string;
}

const STEPS: Step[] = [
  {
    emoji: '🎮',
    title: 'Pick a game!',
    desc: 'Tap any tile on the home screen to start playing',
  },
  {
    emoji: '👆',
    title: 'Tap to play!',
    desc: 'Touch the screen to draw, pop, or tap your way through each game',
  },
  {
    emoji: '🌟',
    title: "Today's challenge!",
    desc: "Check the Daily Drawing Challenge for today's creative prompt",
  },
  {
    emoji: '🖼️',
    title: 'Save your art!',
    desc: 'Draw something → tap Save → find it in your Gallery',
  },
];

const OnboardingOverlay: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(
    () => !storage.get<boolean>(STORAGE_KEY, false),
  );
  const [step, setStep] = useState(0);

  if (!visible) return null;

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  const handleNext = () => {
    if (isLast) {
      storage.set(STORAGE_KEY, true);
      setVisible(false);
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gradient-to-b from-purple-100/95 to-pink-100/95 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Kids Drawing App"
    >
      <div className="kid-card max-w-sm w-full text-center p-8">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === step ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Hero emoji */}
        <div className="text-8xl mb-4" role="img" aria-label={current.title}>
          {current.emoji}
        </div>

        {/* Step text */}
        <h2 className="text-2xl font-bold text-purple-800 mb-2">{current.title}</h2>
        <p className="text-slate-600 text-lg mb-8">{current.desc}</p>

        {/* Action button */}
        <button
          className="kid-button bg-purple-500 hover:bg-purple-600 text-xl px-8 py-3 w-full"
          onClick={handleNext}
        >
          {isLast ? '🎉 Got it!' : 'Next →'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingOverlay;
