/**
 * WeeklySummaryStrip - Header Styles
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { borderRadius } from '../../../theme/spacing';
import { typography, fontWeights } from '@/theme/typography';

export const headerStyles = StyleSheet.create({
  comparisonText: {
    ...typography.caption,
    color: '#78716c', // stone-500
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  headerRight: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  headerTitle: {
    ...typography.button,
    color: '#1c1917', // stone-900
  },
  perfectBadge: {
    backgroundColor: '#10b981', // status.success fallback, overridden by theme in CardContent
    borderRadius: borderRadius.medium,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  perfectBadgeText: {
    ...typography.tabBar,
    color: colors.text.inverse,
    fontWeight: fontWeights.semibold,
  },
  sparkleContainer: {
    position: 'absolute',
    right: -8,
    top: -4,
  },
  sparkleEmoji: {
    fontSize: typography.bodySmall.fontSize,
  },
  titleContainer: {
    position: 'relative',
  },
  trendIcon: {
    marginLeft: 2,
  },
});
