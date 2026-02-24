/**
 * Grid-related styles for ComplianceHeatmap
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors'
import { fontFamilies } from '../../../theme/typography';;
import { spacing } from '../../../theme/spacing';
import { CELL_SIZE } from '../ComplianceHeatmap.constants';

export const gridStyles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    borderRadius: 2,
    height: CELL_SIZE,
    justifyContent: 'center',
    marginBottom: spacing.xs,
    width: CELL_SIZE,
  },
  cellText: {
    color: colors.surface,
    fontFamily: fontFamilies.primary.text,
    fontSize: 8,
    fontWeight: '600',
  },
  scrollView: {
    marginLeft: 24,
    marginTop: 20,
  },
  weekColumn: {
    flexDirection: 'column',
    marginRight: spacing.xs,
  },
  weeksContainer: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
});
