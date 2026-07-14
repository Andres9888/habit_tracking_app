/** Shared type for Advanced Options chips — app tokens only. */
import type { TextStyle } from 'react-native';
import { fontWeights, typography } from '@/theme/typography';

/** Primary chip value ("Off", "7", "···") — bodyBold + tabular nums. */
export const chipValueText: TextStyle = {
  ...typography.bodyBold,
  lineHeight: 20,
  fontVariant: ['tabular-nums'],
};

/**
 * Uppercase micro-labels (NO GOAL, STARTER, START, DAYS).
 * tabBar floor (10px) + semibold — same pattern as settings badges.
 */
export const chipMicroLabel: TextStyle = {
  ...typography.tabBar,
  fontWeight: fontWeights.semibold,
  letterSpacing: 0.6,
};
