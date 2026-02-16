/**
 * Science box styles for FullsizeTemplatePreview (theme-aware)
 */

import { StyleSheet } from 'react-native';
import { borderRadius } from '../../../theme/spacing';
import { typography } from '@/theme/typography';
import type { SemanticColors } from '../../../../theme/darkColors';

export const createScienceStyles = (tc: SemanticColors) =>
  StyleSheet.create({
    researchLinkButton: {
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: tc.infoBoxBg,
      borderColor: tc.infoBoxBorder,
      borderRadius: borderRadius.medium,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 8,
      marginTop: 16,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    researchLinkText: {
      color: tc.infoBoxText,
      fontSize: typography.bodySmall.fontSize,
      fontWeight: '600',
    },
    scienceBox: {
      backgroundColor: tc.scienceBg,
      borderColor: tc.scienceBorder,
      borderRadius: borderRadius.large,
      borderWidth: 2,
      marginHorizontal: 20,
      marginTop: 24,
      padding: 20,
    },
    scienceDivider: {
      backgroundColor: tc.scienceBorder,
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
      color: tc.scienceText,
      fontSize: typography.caption.fontSize,
      fontWeight: '700',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    scienceQuote: {
      color: tc.scienceText,
      fontSize: 15,
      fontStyle: 'italic',
      lineHeight: 24,
    },
  });

/** @deprecated Light mode defaults - use createScienceStyles(themeColors) */
export const scienceStyles = createScienceStyles({
  infoBoxBg: '#EFF6FF',
  infoBoxBorder: '#BFDBFE',
  infoBoxText: '#2563EB',
  scienceBg: '#f0fdf4',
  scienceBorder: '#bbf7d0',
  scienceText: '#166534',
} as any);
