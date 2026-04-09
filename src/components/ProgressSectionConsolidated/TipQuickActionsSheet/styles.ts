/**
 * TipQuickActionsSheet Styles
 */

import { StyleSheet } from 'react-native';

import { borderRadius } from '../../../theme/spacing';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../theme/typography';

export function useStyles() {
  const { colors, isDark } = useThemeColors();

  return StyleSheet.create({
    actionItem: {
      alignItems: 'center',
      borderRadius: borderRadius.medium,
      flexDirection: 'row',
      gap: 12,
      padding: 12,
    },
    actionItemPressed: {
      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
    },
    actionLabel: {
      ...typography.bodySmall,
      color: colors.text.primary,
      fontWeight: fontWeights.semibold,
    },
    actionsList: {
      gap: 4,
      paddingHorizontal: 8,
      paddingTop: 8,
    },
    actionSubtitle: {
      ...typography.caption,
      color: colors.text.secondary,
      marginTop: 2,
    },
    actionTextContainer: {
      flex: 1,
    },
    bottomPadding: {
      height: 8,
    },
    closeButton: {
      alignItems: 'center',
      height: 40,
      justifyContent: 'center',
      width: 40,
    },
    container: {
      paddingBottom: 8,
    },
    divider: {
      backgroundColor: colors.border,
      height: 1,
      marginHorizontal: 16,
    },
    header: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 12,
      paddingHorizontal: 8,
      paddingTop: 8,
    },
    headerSubtitle: {
      ...typography.bodySmall,
      color: colors.text.secondary,
      marginTop: 4,
    },
    headerTextContainer: {
      flex: 1,
      paddingRight: 8,
    },
    headerTitle: {
      ...typography.body,
      color: colors.text.primary,
      fontWeight: fontWeights.bold,
    },
    iconContainer: {
      alignItems: 'center',
      borderRadius: borderRadius.medium,
      height: 40,
      justifyContent: 'center',
      width: 40,
    },
  });
}
