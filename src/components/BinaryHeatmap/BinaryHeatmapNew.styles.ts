/**
 * Styles for BinaryHeatmapNew Component
 *
 * Color-dependent styles (container bg, text colors) are applied inline
 * via getHeatmapColors(isDark) so they adapt to dark mode.
 */

import { StyleSheet } from 'react-native';

import { CELL_SIZE, CELL_GAP, DAY_LABEL_WIDTH, MONTH_LABEL } from './constants';
import { typography } from '../../theme/typography';

export const styles = StyleSheet.create({
  cell: {
    borderRadius: 2,
    height: CELL_SIZE,
    marginRight: CELL_GAP,
    width: CELL_SIZE,
  },
  container: {
    borderRadius: 12,
    padding: 16,
  },
  dayLabelCell: {
    height: CELL_SIZE,
    justifyContent: 'center',
    marginBottom: CELL_GAP,
  },
  dayLabelsColumn: {
    marginRight: CELL_GAP,
    width: DAY_LABEL_WIDTH,
  },
  dayLabelText: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'right',
  },
  gridContainer: {
    flexDirection: 'row',
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: CELL_GAP,
  },
  gridWrapper: {
    marginTop: 12,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '600',
  },
  monthLabel: {
    fontSize: 10,
    position: 'absolute',
  },
  monthLabelSpacer: {
    height: MONTH_LABEL.HEIGHT + CELL_GAP,
  },
  monthLabelsRow: {
    height: MONTH_LABEL.HEIGHT,
    marginBottom: CELL_GAP,
    position: 'relative',
  },
});
