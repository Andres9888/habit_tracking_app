/**
 * Styles for GitHubHeatmap component
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

const CELL_SIZE = 11;
const CELL_GAP = 3;

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  weeksContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  weekColumn: {
    flexDirection: 'column',
    marginRight: CELL_GAP,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 2,
    marginBottom: CELL_GAP,
  },
  dayLabel: {
    fontSize: 10,
    color: colors.text.tertiary,
    width: 24,
    textAlign: 'right',
    paddingRight: 8,
    lineHeight: CELL_SIZE,
  },
  monthLabel: {
    fontSize: 10,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  monthLabelContainer: {
    position: 'absolute',
    bottom: -20,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 4,
  },
  legendLabel: {
    fontSize: 11,
    color: colors.text.tertiary,
    marginRight: 8,
  },
  legendItem: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 2,
  },
});

export const darkStyles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  weeksContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  weekColumn: {
    flexDirection: 'column',
    marginRight: CELL_GAP,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 2,
    marginBottom: CELL_GAP,
  },
  dayLabel: {
    fontSize: 10,
    color: colors.dark.text.tertiary,
    width: 24,
    textAlign: 'right',
    paddingRight: 8,
    lineHeight: CELL_SIZE,
  },
  monthLabel: {
    fontSize: 10,
    color: colors.dark.text.tertiary,
    marginTop: 4,
  },
  monthLabelContainer: {
    position: 'absolute',
    bottom: -20,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 4,
  },
  legendLabel: {
    fontSize: 11,
    color: colors.dark.text.tertiary,
    marginRight: 8,
  },
  legendItem: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 2,
  },
});
