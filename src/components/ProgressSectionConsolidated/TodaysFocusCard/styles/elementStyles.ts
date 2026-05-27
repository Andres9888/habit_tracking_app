/**
 * Element Styles
 *
 * Styles for individual UI elements in TodaysFocusCard.
 */

import { StyleSheet } from 'react-native';

import { shadows, borderRadius } from '../../../../theme/spacing';
import { overlays } from '@/theme/colors';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';

export const elementStyles = StyleSheet.create({
  badgeContainer: {
    alignItems: 'center',
    backgroundColor: overlays.glassLight,
    borderRadius: borderRadius.full,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  badgeEmoji: {
    fontSize: 32,
    textAlign: 'center',
  },
  celebrationContent: {
    gap: 2,
  },
  celebrationSubtext: {
    ...typography.bodySmall,
    fontWeight: fontWeights.medium,
  },
  confettiContainer: {
    height: 0,
    left: '50%',
    pointerEvents: 'none',
    position: 'absolute',
    top: '50%',
    width: 0,
    zIndex: 100,
  },
  confettiParticle: {
    ...shadows.subtle,
    position: 'absolute',
    shadowOpacity: 0.15,
  },
  dismissButton: {
    alignItems: 'center',
    paddingBottom: 12,
    paddingTop: 4,
  },
  dismissText: {
    ...typography.caption,
  },
  goalLabel: {
    ...typography.caption,
  },
  goalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  goalValue: {
    ...typography.body,
    fontFamily: fontFamilies.monospace,
    fontWeight: fontWeights.bold,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: overlays.glassLight,
    borderRadius: borderRadius.xl,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  message: {
    ...typography.button,
    marginBottom: 4,
  },
  nextMilestone: {
    ...typography.caption,
    fontWeight: fontWeights.regular,
    opacity: 0.85,
  },
  shareButton: {
    alignItems: 'center',
    backgroundColor: overlays.glassLight,
    borderRadius: borderRadius.xl,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});
