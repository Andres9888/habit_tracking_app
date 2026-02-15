/**
 * Styles for StreakIndicator component
 */

import { StyleSheet } from 'react-native';

import { typography } from '@/theme/typography';

export const styles = StyleSheet.create({
  bestStreakContainer: {
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  bestStreakText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '600',
  },
  // Compact View Styles
  compactContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  compactContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },

  fireEmoji: {
    fontSize: typography.body.fontSize,
  },

  // Full View Styles
  fullContainer: {
    padding: 16,
  },

  fullRow: {
    marginBottom: 12,
  },

  fullStreakInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  fullTextContainer: {
    flex: 1,
  },
  milestoneBadge: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  milestoneBadgeEmoji: {
    fontSize: typography.body.fontSize,
  },
  milestoneBadgeLabel: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
  },
  milestoneBadgeLarge: {
    fontSize: 24,
    marginLeft: -4,
  },
  milestoneEmoji: {
    fontSize: typography.bodySmall.fontSize,
    marginLeft: -2,
  },
  // Milestones Legend Styles
  milestonesLegend: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },

  streakLabel: {
    fontSize: typography.bodySmall.fontSize,
    marginTop: 2,
  },

  streakNumber: {
    fontSize: 15,
    fontWeight: '600',
  },

  streakNumberLarge: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 36,
  },

  zeroStreakContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },

  zeroStreakText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
});
