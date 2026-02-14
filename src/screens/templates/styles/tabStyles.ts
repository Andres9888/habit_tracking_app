/**
 * Tab Styles - Theme-aware via semantic tokens
 *
 * Note: Static styles only. Theme-dependent colors (background, text)
 * are applied inline via useThemeColors() in the TabBar component.
 */
import { StyleSheet } from 'react-native';
import { typography } from '../../../../theme/typography';

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
<<<<<<< HEAD
    fontSize: 13,
=======
    color: '#a8a29e',
    ...typography.caption,
>>>>>>> bc0f7748 (ui: migrate hardcoded font sizes to typography tokens across auth + template screens)
    fontWeight: '700',
    marginLeft: 6,
  },
  tabCountActive: {
    // Applied dynamically via theme colors in TabBar
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
<<<<<<< HEAD
    fontSize: 13,
=======
    color: '#78716c',
    ...typography.caption,
>>>>>>> bc0f7748 (ui: migrate hardcoded font sizes to typography tokens across auth + template screens)
    fontWeight: '600',
  },
  tabTextActive: {
    // Applied dynamically via theme colors in TabBar
  },
});
