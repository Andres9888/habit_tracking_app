/**
 * Styles for BinaryHeatmapGrid Component
 *
 * Text color for day labels is applied inline via getHeatmapColors(isDark).
 */

import { StyleSheet } from 'react-native';

import { CELL_SIZE, CELL_GAP, DAY_LABEL_WIDTH, MONTH_LABEL } from './constants';

export const styles = StyleSheet.create({
  cellWrapper: {
    marginRight: CELL_GAP,
  },
  container: {
    flexDirection: 'row',
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
    paddingRight: 4,
    textAlign: 'right',
  },
  gridContainer: {
    flexDirection: 'column',
  },
  gridContentContainer: {
    flexDirection: 'column',
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: CELL_GAP,
  },
  gridScrollContent: {
    flexGrow: 1,
  },
  monthLabelSpacer: {
    height: MONTH_LABEL.HEIGHT + CELL_GAP,
  },
});
