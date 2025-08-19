/**
 * Device detection utilities for mobile-first responsive design
 */

export const isMobileDevice = (): boolean => {
  // Check if window is available (SSR safety)
  if (typeof window === 'undefined') return false;

  // Check for touch capability
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Check user agent for mobile devices
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUserAgent = mobileRegex.test(navigator.userAgent);

  // Check for small screen size (mobile viewport)
  const isSmallScreen = window.innerWidth <= 768;

  // Consider it mobile if it has touch AND (is mobile user agent OR small screen)
  return hasTouchScreen && (isMobileUserAgent || isSmallScreen);
};

export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const getViewportDimensions = () => {
  if (typeof window === 'undefined') return { width: 0, height: 0 };
  
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

export const isStandalone = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check if running as PWA (standalone mode)
  return window.matchMedia('(display-mode: standalone)').matches ||
         // @ts-expect-error - iOS specific property
         window.navigator.standalone === true;
};