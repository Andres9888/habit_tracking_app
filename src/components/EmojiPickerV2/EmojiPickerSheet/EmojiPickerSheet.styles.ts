/**
 * EmojiPickerSheet Styles
 *
 * Theme-aware styles via `createEmojiSheetStyles(themeColors)`.
 * Static `styles` export preserved for sub-components using only layout/palette values.
 */

import { StyleSheet, Dimensions } from 'react-native';

import { colors } from '../../../theme/colors';
import { lightColors, type SemanticColors } from '../../../theme/darkColors';
import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
export const SHEET_HEIGHT = SCREEN_HEIGHT * 0.7;

/**
 * Creates theme-aware styles for EmojiPickerSheet components.
 *
 * @param themeColors - Semantic colors from `useThemeColors()`
 */
export function createEmojiSheetStyles(themeColors: SemanticColors) {
  return StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: '#000000',
    },
    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
    },
    handle: {
      backgroundColor: colors.gray[300],
      borderRadius: 2,
      height: 4,
      width: 40,
    },
    handleContainer: {
      alignItems: 'center',
      paddingBottom: spacing.sm,
      paddingTop: spacing.md,
    },
    noIconButton: {
      alignItems: 'center',
      backgroundColor: colors.gray[100],
      borderRadius: borderRadius.medium,
      height: 48,
      justifyContent: 'center',
      width: '100%',
    },
    noIconContainer: {
      borderTopColor: colors.gray[100],
      borderTopWidth: 1,
      paddingBottom: spacing.lg,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    noIconText: {
      color: colors.gray[500],
      fontSize: typography.bodySmall.fontSize,
      fontWeight: '500',
    },
    searchBar: {
      alignItems: 'center',
      backgroundColor: themeColors.gray[50],
      borderColor: colors.border,
      borderRadius: borderRadius.large,
      borderWidth: 1,
      flexDirection: 'row',
      height: 48,
      paddingHorizontal: spacing.base,
    },
    searchContainer: {
      marginBottom: spacing.md,
      marginHorizontal: spacing.lg,
    },
    searchInput: {
      color: colors.gray[900],
      flex: 1,
      fontSize: typography.body.fontSize,
      marginLeft: spacing.sm,
    },
    sheet: {
      ...shadows.modal,
      backgroundColor: themeColors.surface,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      height: SHEET_HEIGHT,
    },
  });
}

/** Static light-mode styles for sub-components that don't need theme awareness */
export const styles = createEmojiSheetStyles(lightColors);
