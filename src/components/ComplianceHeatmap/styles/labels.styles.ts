/**
 * Label-related styles for ComplianceHeatmap
 */

import { StyleSheet } from 'react-native';

import { CELL_SIZE } from '../ComplianceHeatmap.constants';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

export const labelStyles = StyleSheet.create({
  dayLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontSize: 10,
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
    fontSize: 10,
  },
});
