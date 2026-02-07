import { StyleSheet, Dimensions } from 'react-native';
import { borderRadius } from '../../theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const CHART_WIDTH = SCREEN_WIDTH - 48;

export const styles = StyleSheet.create({
  chartContainer: {
    flexDirection: 'row',
    padding: 12,
  },
  container: {
    gap: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    paddingTop: 8,
  },
  legendColor: {
    borderRadius: borderRadius.small,
    height: 12,
    width: 12,
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 48,
  },
});
