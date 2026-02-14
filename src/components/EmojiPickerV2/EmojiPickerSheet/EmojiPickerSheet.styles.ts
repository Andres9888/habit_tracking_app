/**
 * EmojiPickerSheet Styles
 * Theme-aware styles for dark mode support
 */

import { StyleSheet, Dimensions } from 'react-native';

import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import type { SemanticColors } from '../../../theme/darkColors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
export const SHEET_HEIGHT_COLLAPSED = SCREEN_HEIGHT * 0.6;
export const SHEET_HEIGHT_EXPANDED = SCREEN_HEIGHT * 0.8;

/**
 * Static styles that don't depend on theme colors.
 */
export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  handleContainer: {
    alignItems: 'center',
    paddingBottom: spacing.sm,
    paddingTop: spacing.md,
  },
  noIconContainer: {
    borderTopWidth: 1,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  noIconButton: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 48,
    justifyContent: 'center',
    width: '100%',
  },
  noIconText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '500',
  },
  searchBar: {
    alignItems: 'center',
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
    flex: 1,
    fontSize: typography.body.fontSize,
    marginLeft: spacing.sm,
  },
});

/**
 * Dynamic styles that depend on theme colors.
 */
export const themedStyles = (c: SemanticColors) =>
  StyleSheet.create({
    handle: {
      backgroundColor: c.gray[300],
      borderRadius: 4,
      height: 4,
      width: 40,
    },
    noIconButton: {
      backgroundColor: c.gray[100],
    },
    noIconContainer: {
      borderTopColor: c.gray[100],
    },
    noIconText: {
      color: c.gray[500],
    },
    searchBar: {
      backgroundColor: c.gray[50],
      borderColor: c.border,
    },
    searchInput: {
      color: c.text.primary,
    },
    sheet: {
      ...shadows.modal,
      backgroundColor: c.surface,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      elevation: 20,
      height: SHEET_HEIGHT_EXPANDED,
      shadowOffset: { height: -4, width: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
    },
  });
