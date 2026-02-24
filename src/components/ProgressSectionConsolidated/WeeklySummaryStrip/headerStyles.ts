/**
 * WeeklySummaryStrip - Header Styles
 */

import { StyleSheet } from 'react-native';

import { borderRadius } from '../../../theme/spacing';
import { typography, fontFamilies} from '@/theme/typography';

export const headerStyles = StyleSheet.create({
  comparisonText: {
    color: '#78716c', // stone-500
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
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
    color: '#1c1917', // stone-900
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.body.fontSize,
    fontWeight: '600',
  },
  perfectBadge: {
    backgroundColor: '#10b981', // emerald-500
    borderRadius: borderRadius.medium,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  perfectBadgeText: {
    color: '#ffffff',
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.tabBar.fontSize,
    fontWeight: '600',
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
