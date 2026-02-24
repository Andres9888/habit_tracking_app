/**
 * Tab Shared Styles
 * Common styles used across dashboard tab components.
 */

import { StyleSheet } from 'react-native';
import { fontFamilies } from '@/theme/typography';

export const tabStyles = StyleSheet.create({
  container: { gap: 12, padding: 8 },
  emptyText: {
    color: 'rgba(255,255,255,0.4)',
    fontFamily: fontFamilies.monospace,
    fontSize: 11,
    textAlign: 'center',
  },
  history: { gap: 4 },
  historyBar: { borderRadius: 1, flex: 1, minWidth: 3 },
  historyChart: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 4,
    flexDirection: 'row',
    gap: 1,
    height: 40,
    padding: 4,
  },
  historyLabel: { color: 'rgba(255,255,255,0.5)', fontFamily: fontFamilies.monospace, fontSize: 10 },
  mainMetric: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scrollView: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 4,
    maxHeight: 80,
    padding: 4,
  },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontFamily: fontFamilies.monospace, fontSize: 12 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  stats: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    gap: 4,
    padding: 8,
  },
  statValue: {
    color: '#ffffff',
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '600',
  },
});

export const valueStyles = StyleSheet.create({
  label: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  value: {
    color: '#ffffff',
    fontFamily: 'monospace',
    fontSize: 28,
    fontWeight: '700',
  },
  valueLarge: {
    color: '#ffffff',
    fontFamily: 'monospace',
    fontSize: 36,
    fontWeight: '700',
  },
});
