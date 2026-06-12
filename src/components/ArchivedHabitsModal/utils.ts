import type { StrengthInfo } from './types';
import { durations } from '@/theme/animations';

export const CARD_ANIMATION_DURATION = durations.enter;
export const EXIT_ANIMATION_DURATION = durations.transition;

/**
 * Get strength level info based on percentage
 */
export const getStrengthInfo = (
  strength: number,
  isDark = false
): StrengthInfo => {
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
      bgColor: '',
      bgStyle: isDark ? 'rgba(5,150,105,0.15)' : '#D1FAE5',
      emoji: '💪',
      label: 'Strong',
      textColor: '',
      textStyle: isDark ? '#34D399' : '#047857',
    };
  }
  if (strength >= 40) {
    return {
      bgColor: '',
      bgStyle: isDark ? 'rgba(5,150,105,0.15)' : '#D1FAE5',
      emoji: '🌳',
      label: 'Developing',
      textColor: '',
      textStyle: isDark ? '#6EE7B7' : '#047857',
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
    bgColor: '',
    bgStyle: isDark ? 'rgba(239,68,68,0.15)' : '#FEE2E2',
    emoji: '🌱',
    label: 'Starting',
    textColor: '',
    textStyle: isDark ? '#FCA5A5' : '#DC2626',
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
