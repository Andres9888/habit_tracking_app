/**
 * Element Styles
 *
 * Styles for individual UI elements in TodaysFocusCard.
 */

import { StyleSheet } from 'react-native';

import { shadows, borderRadius } from '../../../../theme/spacing';
import { typography } from '@/theme/typography';

export const elementStyles = StyleSheet.create({
  badgeContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
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
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '500',
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
    fontSize: typography.caption.fontSize,
    fontWeight: '500',
  },
  goalLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  goalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  goalValue: {
    fontSize: typography.body.fontSize,
    fontWeight: '700',
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.xl,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  message: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    marginBottom: 4,
  },
  nextMilestone: {
    fontSize: typography.caption.fontSize,
    fontWeight: '400',
    opacity: 0.85,
  },
  shareButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.xl,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});
