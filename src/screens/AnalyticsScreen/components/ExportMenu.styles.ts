/**
 * Styles for ExportMenu component
 */
import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing, borderRadius } from '../../../theme/spacing';

export const styles = StyleSheet.create({
  exportMenu: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  exportMenuCancel: {
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingVertical: spacing.md,
  },
  exportMenuCancelText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  exportMenuItem: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.button,
    flexDirection: 'row',
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  exportMenuItemContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  exportMenuItemDescription: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  exportMenuItemTitle: {
    ...typography.bodyBold,
    color: colors.text.primary,
  },
  exportMenuTitle: {
    ...typography.heading3,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  modalOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
});
