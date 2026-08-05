/**
 * Styles for MonthLabelsRow Component
 */

import { StyleSheet } from 'react-native';

import { CELL_GAP, COLORS, MONTH_LABEL } from './constants';
import { fontFamilies, fontWeights } from '@/theme/typography';

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
    color: COLORS.TEXT_SECONDARY,
    fontFamily: fontFamilies.primary.text,
    fontSize: MONTH_LABEL.FONT_SIZE,
    fontWeight: fontWeights.medium,
  },
});
