/**
 * Styles for StreakIntervals component
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
    alignItems: 'center',
  },
  cardDark: {
    backgroundColor: colors.dark.gray[900],
    borderColor: colors.dark.border,
  },
  cardTitle: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginBottom: 8,
  },
  cardTitleDark: {
    color: colors.dark.text.tertiary,
  },
  streakValue: {
    fontSize: 42,
    fontWeight: '700',
    color: colors.primary[500],
    marginBottom: 4,
  },
  longestStreak: {
    color: colors.text.primary,
  },
  streakLabel: {
    fontSize: 13,
    color: colors.text.tertiary,
  },
  streakLabelDark: {
    color: colors.dark.text.tertiary,
  },
  summaryCard: {
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.gray[200],
    alignItems: 'center',
  },
  summaryCardDark: {
    backgroundColor: colors.dark.gray[900],
    borderColor: colors.dark.border,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  summaryTitleDark: {
    color: colors.dark.text.primary,
  },
  summarySubtitle: {
    fontSize: 13,
    color: colors.text.tertiary,
  },
  summarySubtitleDark: {
    color: colors.dark.text.tertiary,
  },
});
