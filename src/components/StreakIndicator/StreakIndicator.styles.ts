/**
 * Styles for StreakIndicator component
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    fontSize: 16,
  },
  // Full View Styles
  fullContainer: {
    padding: 16,
  },

  fullRow: {
    marginBottom: 12,
  },

  bestStreakContainer: {
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  fullStreakInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  bestStreakText: {
    fontSize: 14,
    fontWeight: '600',
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
  milestoneEmoji: {
    fontSize: 14,
    marginLeft: -2,
  },
  milestoneBadgeEmoji: {
    fontSize: 16,
  },
  zeroStreakContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  milestoneBadgeLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  zeroStreakText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  milestoneBadgeLarge: {
    fontSize: 24,
    marginLeft: -4,
  },

  streakNumber: {
    fontSize: 15,
    fontWeight: '600',
  },

  // Milestones Legend Styles
  milestonesLegend: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },

  streakLabel: {
    fontSize: 14,
    marginTop: 2,
  },

  streakNumberLarge: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 36,
  },
});
