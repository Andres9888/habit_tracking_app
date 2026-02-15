/**
 * SuggestedActions Styles
 */

import { StyleSheet } from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const suggestedActionsStyles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: spacing.sm,
  },
  actionButtonText: {
    ...typography.body,
    color: colors.primary[700],
    marginLeft: spacing.sm,
  },
  suggestedActions: {
    backgroundColor: colors.background,
    borderRadius: 8,
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  suggestedActionsTitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
});
