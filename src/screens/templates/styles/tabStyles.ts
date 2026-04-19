/**
 * Tab Styles - Theme-aware via semantic tokens
 *
 * Note: Static styles only. Theme-dependent colors (background, text)
 * are applied inline via useThemeColors() in the TabBar component.
 */
import { StyleSheet } from 'react-native';
import { borderRadius } from '@/theme/spacing';
import { fontWeights, typography } from '@/theme/typography';

export const tabStyles = StyleSheet.create({
  tab: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 44,
    paddingVertical: 12,
    zIndex: 1,
  },
  tabBar: {
    borderRadius: borderRadius.medium,
    flexDirection: 'row',
    marginBottom: 12,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 5,
    position: 'relative',
  },
  tabCount: {
    ...typography.caption,
    fontWeight: fontWeights.bold,
    marginLeft: 6,
  },
  tabCountActive: {
    // Applied dynamically via theme colors in TabBar
  },
  tabIndicator: {
    borderRadius: borderRadius.medium,
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
    ...typography.caption,
    fontWeight: fontWeights.semibold,
  },
  tabTextActive: {
    // Applied dynamically via theme colors in TabBar
  },
});
