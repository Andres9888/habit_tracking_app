/**
 * Video link styles for FullsizeTemplatePreview
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '@/theme/typography';

const PLAY_ICON_SIZE = 44;

export const videoStyles = StyleSheet.create({
  arrow: {
    ...typography.heading3,
    color: colors.gray[300],
  },
  label: {
    ...typography.bodySmall,
    color: colors.gray[800],
    fontWeight: fontWeights.semibold,
  },
  playCircle: {
    alignItems: 'center',
    backgroundColor: '#FF0000',
    borderRadius: PLAY_ICON_SIZE / 2,
    height: PLAY_ICON_SIZE,
    justifyContent: 'center',
    width: PLAY_ICON_SIZE,
  },
  row: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: borderRadius.large,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  subtitle: {
    ...typography.caption,
    color: colors.gray[400],
    marginTop: 2,
  },
  textColumn: {
    flex: 1,
  },
});
