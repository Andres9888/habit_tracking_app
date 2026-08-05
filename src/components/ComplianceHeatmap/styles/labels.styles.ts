/**
 * Label-related styles for ComplianceHeatmap
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { CELL_SIZE } from '../ComplianceHeatmap.constants';

export const labelStyles = StyleSheet.create({
  dayLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontSize: typography.tabBar.fontSize,
    textAlign: 'center',
  },
  dayLabelCell: {
    height: CELL_SIZE,
    justifyContent: 'center',
    marginBottom: spacing.xs,
    width: 20,
  },
  dayLabelsContainer: {
    flexDirection: 'column',
    left: 0,
    position: 'absolute',
    top: 40,
    zIndex: 1,
  },
  monthLabel: {
    position: 'absolute',
    top: 0,
  },
  monthLabelsContainer: {
    height: 20,
    position: 'relative',
  },
  monthLabelText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontSize: typography.tabBar.fontSize,
  },
});
