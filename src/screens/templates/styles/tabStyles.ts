/**
 * Tab Styles - Theme-aware via semantic tokens
 *
 * Note: Static styles only. Theme-dependent colors (background, text)
 * are applied inline via useThemeColors() in the TabBar component.
 */
import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

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
<<<<<<< HEAD
  tabBar: {
=======
  tabActive: {
    backgroundColor: colors.surface,
    elevation: 3,
    shadowColor: colors.gray[900],
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabBar: {
    backgroundColor: colors.surface,
>>>>>>> 18d9d6cc (ui: replace hardcoded colors with theme tokens in templates & analytics screens)
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
=======
    color: colors.gray[400],
>>>>>>> 18d9d6cc (ui: replace hardcoded colors with theme tokens in templates & analytics screens)
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  tabCountActive: {
<<<<<<< HEAD
    // Applied dynamically via theme colors in TabBar
  },
  tabIndicator: {
=======
    color: colors.primary[600],
  },
  tabIndicator: {
    backgroundColor: colors.surface,
>>>>>>> 18d9d6cc (ui: replace hardcoded colors with theme tokens in templates & analytics screens)
    borderRadius: 12,
    bottom: 5,
    elevation: 3,
    left: 5,
    position: 'absolute',
<<<<<<< HEAD
=======
    shadowColor: colors.primary[600],
>>>>>>> 18d9d6cc (ui: replace hardcoded colors with theme tokens in templates & analytics screens)
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    top: 5,
  },
  tabText: {
<<<<<<< HEAD
=======
    color: colors.gray[500],
>>>>>>> 18d9d6cc (ui: replace hardcoded colors with theme tokens in templates & analytics screens)
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
<<<<<<< HEAD
    // Applied dynamically via theme colors in TabBar
=======
    color: colors.primary[700],
>>>>>>> 18d9d6cc (ui: replace hardcoded colors with theme tokens in templates & analytics screens)
  },
});
