/**
 * Styles for BestWorstDayAnalysis component
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    gap: 16,
  },
  card: {
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  cardDark: {
    backgroundColor: colors.dark.gray[900],
    borderColor: colors.dark.border,
  },
  title: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginBottom: 12,
  },
  titleDark: {
    color: colors.dark.text.tertiary,
  },
  dayName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  dayNameDark: {
    color: colors.dark.text.primary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary[500],
  },
  statLabel: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  statLabelDark: {
    color: colors.dark.text.tertiary,
  },
  period: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  periodDark: {
    color: colors.dark.text.tertiary,
  },
  breakdownContainer: {
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  breakdownContainerDark: {
    backgroundColor: colors.dark.gray[900],
    borderColor: colors.dark.border,
  },
  dayStatItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
    minWidth: 50,
  },
  dayStatName: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  dayStatNameDark: {
    color: colors.dark.text.tertiary,
  },
  dayStatRate: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  dayStatRateDark: {
    color: colors.dark.text.primary,
  },
  dayStatCount: {
    fontSize: 11,
    color: colors.text.tertiary,
  },
  dayStatCountDark: {
    color: colors.dark.text.tertiary,
  },
  peakHourLabel: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginBottom: 8,
  },
  peakHourLabelDark: {
    color: colors.dark.text.tertiary,
  },
  peakHourValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary[500],
  },
  peakHourSubtext: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  peakHourSubtextDark: {
    color: colors.dark.text.tertiary,
  },
});
