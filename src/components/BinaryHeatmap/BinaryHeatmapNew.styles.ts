/**
 * Styles for BinaryHeatmapNew Component
 */

import { StyleSheet } from 'react-native';

import {
  COLORS,
  CELL_SIZE,
  CELL_GAP,
  DAY_LABEL_WIDTH,
  MONTH_LABEL,
} from './constants';
import { typography, fontFamilies} from '../../theme/typography';

export const styles = StyleSheet.create({
  cell: {
    borderRadius: 2,
    height: CELL_SIZE,
    marginRight: CELL_GAP,
    width: CELL_SIZE,
  },
  container: {
    backgroundColor: COLORS.CARD_BACKGROUND,
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
    color: COLORS.TEXT_SECONDARY,
    fontFamily: fontFamilies.primary.text,
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
    color: COLORS.TEXT_PRIMARY,
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '600',
  },
  monthLabel: {
    color: COLORS.TEXT_SECONDARY,
    fontFamily: fontFamilies.primary.text,
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
