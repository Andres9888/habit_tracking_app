/**
 * Science box styles for FullsizeTemplatePreview
 */

import { StyleSheet } from 'react-native';

import { borderRadius } from '../../../theme/spacing';
import { typography } from '@/theme/typography';
import { SemanticColors } from '../../../theme/darkColors';

export const createScienceStyles = (colors: SemanticColors) =>
  StyleSheet.create({
    researchLinkButton: {
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: colors.info.background,
      borderColor: colors.info.border,
      borderRadius: borderRadius.medium,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 8,
      marginTop: 16,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    researchLinkText: {
      color: colors.info.text,
      fontSize: typography.bodySmall.fontSize,
      fontWeight: '600',
    },
    scienceBox: {
      backgroundColor: colors.success.background,
      borderColor: colors.success.border,
      borderRadius: borderRadius.large,
      borderWidth: 2,
      marginHorizontal: 20,
      marginTop: 24,
      padding: 20,
    },
    scienceDivider: {
      backgroundColor: colors.success.border,
      height: 1,
      marginBottom: 12,
    },
    scienceHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 8,
      marginBottom: 12,
    },
    scienceIcon: {
      fontSize: typography.heading2.fontSize,
    },
    scienceLabel: {
      color: colors.success.text,
      fontSize: typography.caption.fontSize,
      fontWeight: '700',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    scienceQuote: {
      color: colors.success.text,
      fontSize: 15,
      fontStyle: 'italic',
      lineHeight: 24,
    },
  });
