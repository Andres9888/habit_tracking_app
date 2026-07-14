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
 * 9px + tight tracking so 5 chips fit without clipping.
 */
export const chipMicroLabel: TextStyle = {
  fontFamily: typography.tabBar.fontFamily,
  fontSize: 9,
  fontWeight: fontWeights.bold,
  letterSpacing: 0.4,
  lineHeight: 11,
};
