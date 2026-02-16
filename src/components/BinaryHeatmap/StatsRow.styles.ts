/**
 * Styles for StatsRow Component
 *
 * Note: Colors that need theme awareness should be applied at runtime.
 * This file contains only layout-related styles.
 */

import { StyleSheet } from 'react-native';

import { typography } from '../../theme/typography';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  frequency: {
    fontSize: typography.caption.fontSize,
  },
  separator: {
    marginHorizontal: 8,
  },
  streakContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  streakLabel: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
  },
  streakNumber: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
  },
  streakBadge: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});
