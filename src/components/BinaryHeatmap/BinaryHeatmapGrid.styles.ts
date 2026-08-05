/**
 * Styles for BinaryHeatmapGrid Component
 */

import { StyleSheet } from 'react-native';

import { typography, fontFamilies, fontWeights } from '@/theme/typography';
import {
  CELL_SIZE,
  CELL_GAP,
  DAY_LABEL_WIDTH,
  COLORS,
  MONTH_LABEL,
} from './constants';

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
    color: COLORS.TEXT_SECONDARY,
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.tabBar.fontSize,
    fontWeight: fontWeights.medium,
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
