/**
 * HabitStrengthIndicator Styles
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Compact variant (list view)
  compactBar: {
    borderRadius: 2,
    height: '100%',
  },
  compactBarContainer: {
    borderRadius: 2,
    flex: 1,
    height: 4,
    overflow: 'hidden',
  },
  compactContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  compactEmoji: {
    fontSize: 16,
  },

  // Full variant (detail view)
  fullBar: {
    borderRadius: 4,
    height: '100%',
  },
  fullBarContainer: {
    borderRadius: 4,
    height: 8,
    overflow: 'hidden',
    width: '100%',
  },
  fullContainer: {
    gap: 8,
  },
  fullEmoji: {
    fontSize: 32,
  },
  fullHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fullLabelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  // Graph variant (premium)
  graphContainer: {
    alignItems: 'center',
    height: 120,
    justifyContent: 'center',
  },

  // Shared
  percentage: {
    minWidth: 40,
    textAlign: 'right',
  },
});
