/**
 * PerformanceDashboard Styles
 */

import { StyleSheet } from 'react-native';

export const dashboardStyles = StyleSheet.create({
  container: { position: 'absolute', zIndex: 9999 },
  content: { gap: 8 },
  dashboard: {
    backgroundColor: 'rgba(23, 23, 23, 0.95)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    shadowColor: '#1c1917',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  miniMetrics: { flexDirection: 'row', gap: 8, paddingTop: 4 },
});
