/**
 * WeeklySummaryStrip - Header Styles
 */

import { StyleSheet } from 'react-native';

export const headerStyles = StyleSheet.create({
  comparisonText: {
    color: '#78716c', // stone-500
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
    fontSize: 16,
    fontWeight: '600',
  },
  perfectBadge: {
    backgroundColor: '#10b981', // emerald-500
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  perfectBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  sparkleContainer: {
    position: 'absolute',
    right: -8,
    top: -4,
  },
  sparkleEmoji: {
    fontSize: 14,
  },
  titleContainer: {
    position: 'relative',
  },
  trendIcon: {
    marginLeft: 2,
  },
});
