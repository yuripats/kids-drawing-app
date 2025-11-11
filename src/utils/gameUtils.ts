/**
 * Shared Game Utilities
 * Common functions used across multiple games
 */

export type SoundEffect = 'pop' | 'match' | 'mismatch' | 'win' | 'lose' | 'collect' | 'click';

// High Score Management
export const saveHighScore = (gameKey: string, score: number): void => {
  try {
    const currentHighScore = getHighScore(gameKey);
    if (score > currentHighScore) {
      localStorage.setItem(`highScore_${gameKey}`, score.toString());
    }
  } catch (error) {
    console.error('Error saving high score:', error);
  }
};

export const getHighScore = (gameKey: string): number => {
  try {
    const score = localStorage.getItem(`highScore_${gameKey}`);
    return score ? parseInt(score, 10) : 0;
  } catch (error) {
    console.error('Error getting high score:', error);
    return 0;
  }
};

// Generic save/load for game state
export const saveGameData = <T>(gameKey: string, data: T): void => {
  try {
    localStorage.setItem(`gameData_${gameKey}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving game data:', error);
  }
};

export const loadGameData = <T>(gameKey: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(`gameData_${gameKey}`);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('Error loading game data:', error);
    return defaultValue;
  }
};

// Sound Effects
const audioContext = typeof window !== 'undefined' && 'AudioContext' in window
  ? new AudioContext()
  : null;

let audioUnlocked = false;

// Unlock audio on first user interaction (required for iOS)
export const unlockAudio = (): void => {
  if (audioUnlocked || !audioContext) return;

  const buffer = audioContext.createBuffer(1, 1, 22050);
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start(0);

  audioUnlocked = true;
};

export const playSound = (soundType: SoundEffect, volume: number = 0.3): void => {
  if (!audioContext || !audioUnlocked) return;

  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different sounds for different effects
    const now = audioContext.currentTime;

    switch (soundType) {
      case 'pop':
        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.1);
        gainNode.gain.setValueAtTime(volume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
        break;

      case 'match':
        oscillator.frequency.setValueAtTime(523.25, now);
        oscillator.frequency.setValueAtTime(659.25, now + 0.1);
        gainNode.gain.setValueAtTime(volume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
        break;

      case 'mismatch':
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.setValueAtTime(150, now + 0.1);
        gainNode.gain.setValueAtTime(volume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        break;

      case 'win':
        // Ascending arpeggio
        oscillator.frequency.setValueAtTime(523.25, now);
        oscillator.frequency.setValueAtTime(659.25, now + 0.1);
        oscillator.frequency.setValueAtTime(783.99, now + 0.2);
        gainNode.gain.setValueAtTime(volume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        oscillator.start(now);
        oscillator.stop(now + 0.5);
        break;

      case 'lose':
        oscillator.frequency.setValueAtTime(392, now);
        oscillator.frequency.exponentialRampToValueAtTime(196, now + 0.5);
        gainNode.gain.setValueAtTime(volume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        oscillator.start(now);
        oscillator.stop(now + 0.5);
        break;

      case 'collect':
        oscillator.frequency.setValueAtTime(1000, now);
        oscillator.frequency.exponentialRampToValueAtTime(2000, now + 0.1);
        gainNode.gain.setValueAtTime(volume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
        break;

      case 'click':
        oscillator.frequency.setValueAtTime(600, now);
        gainNode.gain.setValueAtTime(volume * 0.5, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        oscillator.start(now);
        oscillator.stop(now + 0.05);
        break;

      default:
        oscillator.frequency.setValueAtTime(440, now);
        gainNode.gain.setValueAtTime(volume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
    }
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

// Visual Effects
export const celebrateWin = (): void => {
  // Create confetti effect
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd93d', '#6bcf7f', '#c77dff'];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    confetti.style.opacity = '1';
    confetti.style.transition = 'all 3s ease-out';

    document.body.appendChild(confetti);

    // Animate
    setTimeout(() => {
      confetti.style.top = '110vh';
      confetti.style.left = (parseFloat(confetti.style.left) + (Math.random() - 0.5) * 50) + 'vw';
      confetti.style.opacity = '0';
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    }, 10);

    // Remove after animation
    setTimeout(() => {
      confetti.remove();
    }, 3000);
  }
};

export const shakeScreen = (element?: HTMLElement): void => {
  const target = element || document.body;
  target.style.animation = 'shake 0.5s';

  setTimeout(() => {
    target.style.animation = '';
  }, 500);
};

// Shuffle array utility (Fisher-Yates)
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Format time (seconds to MM:SS)
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Format score with commas
export const formatScore = (score: number): string => {
  return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Detect mobile device
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Prevent default touch behavior (for games that need it)
export const preventTouchScroll = (element: HTMLElement): (() => void) => {
  const handler = (e: TouchEvent) => {
    e.preventDefault();
  };

  element.addEventListener('touchmove', handler, { passive: false });

  // Return cleanup function
  return () => {
    element.removeEventListener('touchmove', handler);
  };
};

// Random integer in range [min, max]
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Random choice from array
export const randomChoice = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Clamp value between min and max
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

// Check if two rectangles overlap (AABB collision)
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const checkCollision = (rect1: Rectangle, rect2: Rectangle): boolean => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

// Distance between two points
export const distance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

// Add shake animation to CSS if not already present
if (typeof document !== 'undefined') {
  const styleId = 'game-utils-styles';

  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize audio unlock on user interaction
if (typeof document !== 'undefined') {
  const initAudio = () => {
    unlockAudio();
    document.removeEventListener('touchstart', initAudio);
    document.removeEventListener('click', initAudio);
  };

  document.addEventListener('touchstart', initAudio, { once: true });
  document.addEventListener('click', initAudio, { once: true });
}
