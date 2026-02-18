/**
 * Performance Dashboard Styles
 * StyleSheet definitions for the dashboard component.
 *
 * Note: Dynamic theme colors are applied via useThemeColors() in the component.
 * Static styles use fallback colors for light mode; theme context overrides at runtime.
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  closeButton: {
    color: 'rgba(0,0,0,0.6)',
    fontSize: 20,
    fontWeight: '300',
    marginLeft: 8,
  },
  container: {
    position: 'absolute',
    zIndex: 9999,
  },
  content: {
    gap: 8,
  },
  dashboard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    shadowColor: '#000000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  expandButton: {
    padding: 4,
  },
  expandIcon: {
    color: 'rgba(0,0,0,0.6)',
    fontSize: 10,
  },
  fab: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 9999,
  },
  fabText: {
    color: '#000000',
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  headerRight: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerTitle: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  miniLabel: {
    color: 'rgba(0,0,0,0.5)',
    fontSize: 9,
    fontWeight: '500',
  },
  miniMetric: {
    alignItems: 'center',
    flex: 1,
  },
  miniMetrics: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 4,
  },
  miniValue: {
    color: '#000000',
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '600',
  },
  tabContent: {
    minHeight: 120,
  },
});
