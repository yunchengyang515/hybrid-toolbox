import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Determines if the app is running in safe mode
 * This includes running in bolt.new or with VITE_SAFE_MODE=true
 */
export function isSafeMode(): boolean {
  // Check if in bolt.new environment
  const isBoltNew =
    window.location.hostname.includes('bolt.new') ||
    window.location.hostname.includes('stackblitz.com');

  // Check if safe mode is enabled via environment variable
  const isSafeModeEnabled = import.meta.env.VITE_SAFE_MODE === 'true';

  return isBoltNew || isSafeModeEnabled;
}
