/**
 * Tab Styles - Theme-aware base styles for TemplatesScreen tab bar.
 *
 * NOTE: Colors that need dark-mode adaptation are applied inline via
 * useThemeColors() in the TabBar component. This stylesheet provides
 * only layout/geometry values.
 */
import { StyleSheet } from 'react-native';

export const tabStyles = StyleSheet.create({
  tab: {
    alignItems: 'center',
    borderRadius: 12,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 44,
    paddingVertical: 12,
    zIndex: 1,
  },
  tabBar: {
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 12,
    marginHorizontal: 20,
    marginTop: 14,
    padding: 5,
    position: 'relative',
  },
  tabCount: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  tabCountActive: {
    color: '#059669',
  },
  tabIndicator: {
    borderRadius: 12,
    bottom: 5,
    elevation: 3,
    left: 5,
    position: 'absolute',
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    top: 5,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#047857',
  },
});

/* ---- Removed old colour-baked entries ---- */
/* tabActive, tabTextActive, tabCountActive — colours now live in TabBar.tsx */
