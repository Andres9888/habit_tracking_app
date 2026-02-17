/**
 * Styles for StreakTrendsChart component
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  tooltipContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  tooltipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  tooltipSubtext: {
    fontSize: 13,
    marginTop: 4,
  },
});
