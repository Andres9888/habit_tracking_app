import type { StrengthInfo } from './types';

// Animation constants
export const CARD_ANIMATION_DURATION = 300; // 300ms per card
export const CARD_ANIMATION_STAGGER = 50; // 50ms stagger between cards
export const EXIT_ANIMATION_DURATION = 300;

/**
 * Get strength level info based on percentage
 */
export const getStrengthInfo = (strength: number, isDark = false): StrengthInfo => {
  if (strength >= 80) {
    return {
      bgColor: isDark ? 'bg-purple-900/40' : 'bg-purple-50',
      emoji: '⚡',
      label: 'Automatic',
      textColor: isDark ? 'text-purple-300' : 'text-purple-700',
    };
  }
  if (strength >= 60) {
    return {
      bgColor: isDark ? 'bg-emerald-900/40' : 'bg-emerald-50',
      emoji: '💪',
      label: 'Strong',
      textColor: isDark ? 'text-emerald-300' : 'text-emerald-700',
    };
  }
  if (strength >= 40) {
    return {
      bgColor: isDark ? 'bg-teal-900/40' : 'bg-teal-50',
      emoji: '🌳',
      label: 'Developing',
      textColor: isDark ? 'text-teal-300' : 'text-teal-700',
    };
  }
  if (strength >= 20) {
    return {
      bgColor: isDark ? 'bg-yellow-900/40' : 'bg-yellow-50',
      emoji: '🌿',
      label: 'Building',
      textColor: isDark ? 'text-yellow-300' : 'text-yellow-700',
    };
  }
  return {
    bgColor: isDark ? 'bg-rose-900/40' : 'bg-rose-50',
    emoji: '🌱',
    label: 'Starting',
    textColor: isDark ? 'text-rose-300' : 'text-rose-600',
  };
};

/**
 * Get strength gradient color for visual indicators
 */
export const getStrengthGradientColor = (strength: number): string => {
  if (strength >= 80) return '#A855F7'; // purple-500
  if (strength >= 60) return '#10B981'; // emerald-500
  if (strength >= 40) return '#14B8A6'; // teal-500
  if (strength >= 20) return '#EAB308'; // yellow-500
  return '#F43F5E'; // rose-500
};

/**
 * Format timestamp as relative time string
 */
export const getRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  const months = Math.floor(diffDays / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
};
