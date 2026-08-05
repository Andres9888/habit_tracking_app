/**
 * HabitCard Core Styles
 * Implements home-screen-redesign-spec.md:
 * - MinHeight: 88px | Border-radius: 16px (cards)
 * - Card surface: #FFFFFF | Border: 1px #E5E2DE
 * OPTIMIZED: SF Pro font, deeper shadows, proper contrast
 *
 * ACCESSIBILITY: Uses shared focus ring system (src/utils/accessibility/focusRing.ts)
 */

import { StyleSheet, TextStyle } from 'react-native';
import { spacing, borderRadius, shadows } from '@/theme/spacing';
import { airy } from '@/theme/airyScale';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';
import { REDESIGN_COLORS } from './HabitCard.colors';
import { statusStyles } from './HabitCard.statusStyles';

export { actionStyles } from './HabitCard.actionStyles';
export { REDESIGN_COLORS } from './HabitCard.colors';

const coreStyles = StyleSheet.create({
  accentBar: { bottom: 0, left: 0, position: 'absolute', top: 0 },
  bottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: REDESIGN_COLORS.cardSurface,
    borderColor: REDESIGN_COLORS.neutral,
    borderRadius: borderRadius.large,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    ...shadows.card,
  },
  // Card container background for depth
  cardsContainer: {
    backgroundColor: REDESIGN_COLORS.cardBg,
    borderRadius: borderRadius.xl,
    marginHorizontal: spacing.md,
    padding: spacing.md,
  },
  completedText: { opacity: 0.55, textDecorationLine: 'line-through' as const },
  container: {
    marginVertical: spacing.sm,
    minHeight: airy.habitCardMinHeight,
    position: 'relative',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: airy.habitCardPadding,
  },
  disabled: { opacity: 0.5 },
  habitInfo: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
  },
  // Meta text for habit strength
  habitMeta: {
    ...typography.caption,
    color: REDESIGN_COLORS.metaText,
    fontFamily: fontFamilies.primary.text,
    letterSpacing: -0.08,
    marginTop: 2,
  } as TextStyle,
  habitName: {
    ...typography.body,
    color: REDESIGN_COLORS.secondaryText,
    fontFamily: fontFamilies.primary.text,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.41,
    lineHeight: 22,
  } as TextStyle,
  icon: { fontSize: 26 },
  // Streak text with proper contrast
  streakText: {
    ...typography.bodySmall,
    color: REDESIGN_COLORS.streakText,
    fontFamily: fontFamilies.primary.text,
    fontWeight: fontWeights.semibold,
  } as TextStyle,
  strengthFill: { bottom: 0, left: 0, position: 'absolute', top: 0 },
  topRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export const styles = { ...coreStyles, ...statusStyles };
