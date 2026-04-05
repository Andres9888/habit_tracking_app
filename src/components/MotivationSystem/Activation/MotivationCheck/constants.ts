/**
 * MotivationCheck Constants
 *
 * Configuration values for motivation levels and animation springs
 */

import type { MotivationOption, MotivationLevel } from './types';
import { springs } from '@/theme/animations';
import { fontWeights } from '@/theme/typography';

/** Animation spring configs */
export const SPRING_BUTTON = springs.responsive;
export const SPRING_BOUNCY = springs.pop;

/** Motivation level configuration */
export const MOTIVATION_OPTIONS: MotivationOption[] = [
  {
    emoji: '😩',
    label: 'Not at all',
    level: 'not_motivated',
    showsFailure: true,
  },
  { emoji: '😐', label: 'Meh', level: 'meh', showsFailure: true },
  { emoji: '💪', label: 'Ready!', level: 'ready', showsFailure: false },
];

/**
 * Map motivation levels to accent colors
 */
export function getAccentColor(
  level: MotivationLevel
): 'rose' | 'amber' | 'emerald' {
  switch (level) {
    case 'not_motivated': {
      return 'rose';
    }
    case 'meh': {
      return 'amber';
    }
    case 'ready': {
      return 'emerald';
    }
  }
}

/**
 * Returns whether the selected motivation level should show failure visualization
 * Based on Huberman protocol: unmotivated users need fear/loss aversion
 */
export function shouldShowFailureViz(
  level: MotivationLevel | undefined
): boolean {
  if (!level) return false;
  const option = MOTIVATION_OPTIONS.find((opt) => opt.level === level);
  return option?.showsFailure ?? false;
}

/** Dynamic accent classes for each color (non-amber colors use NativeWind) */
export const ACCENT_CLASSES = {
  amber: {
    label: 'font-medium',
    ring: 'border-2',
  },
  emerald: {
    label: 'font-medium',
    ring: 'border-2',
  },
  rose: {
    label: 'font-medium',
    ring: 'border-2',
  },
};

/** Style overrides for amber accent (uses theme tokens) */
export const AMBER_STYLES = {
  label: { fontWeight: fontWeights.medium },
  ring: { borderWidth: 2 },
};
