/**
 * Styles for StreakIndicator component
 */

import { StyleSheet, TextStyle } from 'react-native';
import { typography } from '@/theme/typography';

export const styles = StyleSheet.create({
  bestStreakContainer: {
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  bestStreakText: {
    ...typography.bodySmall,
    fontWeight: '600',
  } as TextStyle,
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
    ...typography.caption,
    fontWeight: '600',
  } as TextStyle,
  milestoneBadgeLarge: {
    fontSize: 24,
    marginLeft: -4,
  },
  milestoneEmoji: {
    ...typography.bodySmall,
    marginLeft: -2,
  } as TextStyle,
  // Milestones Legend Styles
  milestonesLegend: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },

  streakLabel: {
    ...typography.bodySmall,
    marginTop: 2,
  } as TextStyle,

  streakNumber: {
    ...typography.bodySmall,
    fontWeight: '600',
  } as TextStyle,

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
    ...typography.caption,
    fontStyle: 'italic',
  } as TextStyle,
});
