/**
 * Tips box styles for FullsizeTemplatePreview
 */

import { StyleSheet } from 'react-native';

import { borderRadius } from '../../../theme/spacing';
import { typography } from '@/theme/typography';
import { SemanticColors } from '../../../theme/darkColors';

export const createTipsStyles = (colors: SemanticColors) =>
  StyleSheet.create({
    tipIconContainer: {
      alignItems: 'center',
      borderRadius: borderRadius.medium,
      height: 24,
      justifyContent: 'center',
      width: 24,
    },
    tipItem: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: 12,
      marginBottom: 12,
    },
    tipNumber: {
      fontSize: 13,
      fontWeight: '700',
    },
    tipsBox: {
      backgroundColor: colors.warning.background,
      borderColor: colors.warning.border,
      borderRadius: borderRadius.large,
      borderWidth: 2,
      marginHorizontal: 20,
      marginTop: 16,
      padding: 20,
    },
    tipsDivider: {
      backgroundColor: colors.warning.border,
      height: 1,
      marginBottom: 12,
    },
    tipsHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 8,
      marginBottom: 12,
    },
    tipsLabel: {
      color: colors.warning.text,
      fontSize: typography.caption.fontSize,
      fontWeight: '700',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    tipText: {
      color: colors.warning.text,
      flex: 1,
      fontSize: 15,
      lineHeight: 22,
    },
  });
