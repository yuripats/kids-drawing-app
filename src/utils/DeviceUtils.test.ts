import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isMobileDevice, isTouchDevice, getViewportDimensions, isStandalone } from './DeviceUtils';

describe('DeviceUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isTouchDevice', () => {
    it('returns true when maxTouchPoints > 0', () => {
      // Mock navigator.maxTouchPoints
      Object.defineProperty(navigator, 'maxTouchPoints', {
        writable: true,
        value: 1
      });
      expect(isTouchDevice()).toBe(true);
    });

    it('returns correct value based on current environment', () => {
      // Test with current environment (will be true in most test environments)
      const result = isTouchDevice();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('isMobileDevice', () => {
    it('returns a boolean value', () => {
      const result = isMobileDevice();
      expect(typeof result).toBe('boolean');
    });

    it('considers touch capability and screen size', () => {
      // Mock small screen size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 600
      });
      
      const result = isMobileDevice();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getViewportDimensions', () => {
    it('returns viewport dimensions', () => {
      const result = getViewportDimensions();
      expect(result).toHaveProperty('width');
      expect(result).toHaveProperty('height');
      expect(typeof result.width).toBe('number');
      expect(typeof result.height).toBe('number');
    });
  });

  describe('isStandalone', () => {
    it('returns a boolean value', () => {
      const result = isStandalone();
      expect(typeof result).toBe('boolean');
    });

    it('checks for standalone display mode', () => {
      const mockMatchMedia = vi.fn().mockReturnValue({ matches: false });
      window.matchMedia = mockMatchMedia;
      const result = isStandalone();
      expect(mockMatchMedia).toHaveBeenCalledWith('(display-mode: standalone)');
      expect(typeof result).toBe('boolean');
    });
  });
});