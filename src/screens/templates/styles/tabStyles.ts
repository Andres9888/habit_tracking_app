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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  tabBar: {
    backgroundColor: '#f5f5f4',
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 12,
    marginHorizontal: 20,
    marginTop: 14,
    padding: 5,
    position: 'relative',
  },
  tabCount: {
    color: '#a8a29e',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  tabCountActive: {
    color: '#10B981', // Emerald green per spec
  },
  tabIndicator: {
    backgroundColor: '#fff',
    borderRadius: 10,
    bottom: 5,
    elevation: 2,
    left: 5,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    top: 5,
  },
  tabText: {
    color: '#78716c',
    fontSize: 15,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#1c1917',
  },
});
