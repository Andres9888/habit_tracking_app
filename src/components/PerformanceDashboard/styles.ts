/**
 * Performance Dashboard Styles
 * StyleSheet definitions for the dashboard component.
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  closeButton: {
    color: 'rgba(255,255,255,0.6)',
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
    backgroundColor: 'rgba(23, 23, 23, 0.95)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  expandButton: {
    padding: 4,
  },
  expandIcon: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
  },
  fab: {
    alignItems: 'center',
    backgroundColor: 'rgba(23, 23, 23, 0.95)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 9999,
  },
  fabText: {
    color: '#ffffff',
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
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  miniLabel: {
    color: 'rgba(255,255,255,0.5)',
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
    color: '#ffffff',
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '600',
  },
  tabContent: {
    minHeight: 120,
  },
});
