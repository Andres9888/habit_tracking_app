import { StyleSheet } from 'react-native';

import {
  COLORS,
  CELL_SIZE,
  CELL_GAP,
  DAY_LABEL_WIDTH,
  MONTH_LABEL,
} from './constants';
import { borderRadius, shadows } from '../../theme/spacing';
import { typography, fontWeights, fontFamilies } from '../../theme/typography';

export const styles = StyleSheet.create({
  cell: {
    borderRadius: borderRadius.xs,
    height: CELL_SIZE,
    marginRight: CELL_GAP,
    width: CELL_SIZE,
  },
  container: {
    ...shadows.card,
    alignSelf: 'stretch',
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: borderRadius.large,
    borderWidth: 1,
    padding: 16,
    width: '100%',
  },
  dayLabelCell: {
    alignItems: 'center',
    height: CELL_SIZE,
    justifyContent: 'center',
    marginBottom: CELL_GAP,
    width: DAY_LABEL_WIDTH,
  },
  dayLabelsColumn: {
    alignItems: 'center',
    marginRight: CELL_GAP,
    width: DAY_LABEL_WIDTH,
  },
  dayLabelText: {
    color: COLORS.TEXT_SECONDARY,
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.tabBar.fontSize,
    fontWeight: fontWeights.medium,
    lineHeight: CELL_SIZE,
    textAlign: 'center',
    width: DAY_LABEL_WIDTH,
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
    fontWeight: fontWeights.semibold,
  },
  headerStat: {
    alignItems: 'flex-end',
  },
  headerStatCount: {
    color: COLORS.TEXT_SECONDARY,
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.tabBar.fontSize,
    marginTop: 1,
  },
  headerStatPct: {
    fontFamily: fontFamilies.monospace,
    fontSize: 18,
    fontWeight: fontWeights.semibold,
    lineHeight: 20,
  },
  monthLabel: {
    color: COLORS.TEXT_SECONDARY,
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.tabBar.fontSize,
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
