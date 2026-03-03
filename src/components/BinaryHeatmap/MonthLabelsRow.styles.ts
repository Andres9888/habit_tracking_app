/**
 * Styles for MonthLabelsRow Component
 *
 * Text color is applied inline via getHeatmapColors(isDark).
 */

import { StyleSheet } from 'react-native';

import { CELL_GAP, MONTH_LABEL } from './constants';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: MONTH_LABEL.HEIGHT,
    marginBottom: CELL_GAP,
    position: 'relative',
  },
  labelContainer: {
    height: MONTH_LABEL.HEIGHT,
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 0,
  },
  labelText: {
    fontSize: MONTH_LABEL.FONT_SIZE,
    fontWeight: '500',
  },
});
