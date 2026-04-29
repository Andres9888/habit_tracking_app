/**
 * EmojiPickerSheet Styles
 */

import { StyleSheet, Dimensions } from 'react-native';

import { colors } from '../../../theme/colors';
import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { typography, fontWeights, fontFamilies} from '../../../theme/typography';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
export const SHEET_HEIGHT_COLLAPSED = SCREEN_HEIGHT * 0.6;
export const SHEET_HEIGHT_EXPANDED = SCREEN_HEIGHT * 0.8;

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  handle: {
    backgroundColor: colors.gray[300],
    borderRadius: borderRadius.xs,
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
    fontWeight: fontWeights.medium,
  },
  searchBar: {
    alignItems: 'center',
    backgroundColor: colors.light.surfaceMuted,
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
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.body.fontSize,
    marginLeft: spacing.sm,
  },
  sheet: {
    ...shadows.modal,
    backgroundColor: colors.light.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    elevation: 20,
    height: SHEET_HEIGHT_EXPANDED,
    shadowOffset: { height: -4, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
});
