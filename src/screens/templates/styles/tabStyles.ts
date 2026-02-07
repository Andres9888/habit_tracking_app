/**
 * Tab Styles - OPTIMIZED: Emerald active state, stronger shadows
 */
import { StyleSheet } from 'react-native';

export const tabStyles = StyleSheet.create({
  tab: {
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 44,
    paddingVertical: 12,
    zIndex: 1,
  },
  tabActive: {
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabBar: {
    backgroundColor: '#f0eeeb',
    borderRadius: 14,
    flexDirection: 'row',
    marginBottom: 12,
    marginHorizontal: 20,
    marginTop: 14,
    padding: 5,
    position: 'relative',
  },
  tabCount: {
    color: '#a8a29e',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  // OPTIMIZED: Emerald active count
  tabCountActive: {
    color: '#059669',
  },
  tabIndicator: {
    backgroundColor: '#fff',
    borderRadius: 10,
    bottom: 5,
    elevation: 3,
    left: 5,
    position: 'absolute',
    shadowColor: '#059669',
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    top: 5,
  },
  tabText: {
    color: '#78716c',
    fontSize: 15,
    fontWeight: '600',
  },
  // OPTIMIZED: Emerald active text
  tabTextActive: {
    color: '#047857',
  },
});
