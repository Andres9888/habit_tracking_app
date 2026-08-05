/**
 * HabitStrengthIndicator Styles
 */

import { StyleSheet } from 'react-native';
import { borderRadius } from '../../theme/spacing';
import { typography} from '../../theme/typography';

export const styles = StyleSheet.create({
  // Compact variant (list view)
  compactBar: {
    borderRadius: borderRadius.xs,
    height: '100%',
  },
  compactBarContainer: {
    borderRadius: borderRadius.xs,
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
    fontSize: typography.body.fontSize,
  },

  // Full variant (detail view)
  fullBar: {
    borderRadius: borderRadius.xs,
    height: '100%',
  },
  fullBarContainer: {
    borderRadius: borderRadius.xs,
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
