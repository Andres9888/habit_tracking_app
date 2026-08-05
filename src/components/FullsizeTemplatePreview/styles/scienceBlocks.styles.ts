/**
 * Science drill-down — block styles: "What you'll feel" benefits,
 * "What to expect" timeline, and "How to start" steps.
 *
 * Layout only — colors come from `useScienceCard()` at the call site.
 */

import { StyleSheet } from 'react-native';

import { borderRadius, spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

export const scienceBlockStyles = StyleSheet.create({
  // Benefits
  benefitRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.base,
    paddingVertical: 13,
  },
  benefitIcon: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  benefitTitle: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 15,
    fontWeight: fontWeights.semibold,
    lineHeight: 20,
  },
  benefitDesc: { ...typography.caption, marginTop: 1 },
  // Timeline
  spine: {
    borderRadius: 1,
    bottom: 14,
    left: 7,
    position: 'absolute',
    top: 8,
    width: 2,
  },
  tlRow: { flexDirection: 'row', gap: spacing.base, position: 'relative' },
  tlDot: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    height: 16,
    justifyContent: 'center',
    marginTop: 3,
    width: 16,
    zIndex: 1,
  },
  tlWhen: {
    fontFamily: fontFamilies.monospace,
    fontSize: 11,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  tlTitle: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 15,
    fontWeight: fontWeights.semibold,
    lineHeight: 20,
    marginTop: 2,
  },
  tlDesc: { ...typography.caption, lineHeight: 18, marginTop: 2 },
  // How to start
  stepRow: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.md },
  stepNum: {
    alignItems: 'center',
    borderRadius: 13,
    height: 26,
    justifyContent: 'center',
    marginTop: 1,
    width: 26,
  },
  stepNumText: { ...typography.caption, fontWeight: fontWeights.bold },
  stepText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 15,
    lineHeight: 22,
  },
  // Reassurance line under the timeline. Quiet by design: it should read as a
  // footnote the reader finds, not a warning the page leads with.
  timelineNote: {
    ...typography.bodySmall,
    lineHeight: 20,
    marginTop: spacing.sm,
    paddingHorizontal: 4,
  },
});
