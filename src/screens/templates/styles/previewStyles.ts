import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { lightColors } from '../../../theme/darkColors';
import type { SemanticColors } from '../../../theme/darkColors';
import { borderRadius } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

type PreviewThemeColors = Pick<SemanticColors, 'primary'> & {
  error: string;
  errorLight: string;
};

export const getPreviewStyles = (themeColors: PreviewThemeColors) =>
  StyleSheet.create({
    previewActions: {
      marginTop: 32,
    },
    previewCategory: {
      marginTop: 6,
    },
    previewHeader: {
      alignItems: 'center',
    },
    previewIcon: {
      fontSize: typography.displayLarge.fontSize,
    },
    previewIconContainer: {
      alignItems: 'center',
      height: 80,
      justifyContent: 'center',
      width: 80,
    },
    previewModal: {
      paddingBottom: 24,
    },
    previewScienceBox: {
      alignItems: 'flex-start',
      borderColor: themeColors.primary[700],
      borderRadius: borderRadius.medium,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 12,
      padding: 16,
    },
    previewScrollContent: {
      flexGrow: 1,
      paddingBottom: 20,
    },
    researchLink: {
      alignItems: 'center',
      flexDirection: 'row',
      marginTop: 8,
    },
    scienceIcon: {
      fontSize: typography.body.fontSize,
    },
    youtubeIcon: {
      fontSize: typography.body.fontSize,
    },
    youtubeIconWrapper: {
      alignItems: 'center',
      backgroundColor: themeColors.error,
      borderRadius: borderRadius.medium,
      height: 40,
      justifyContent: 'center',
      width: 40,
    },
    youtubeLink: {
      alignItems: 'center',
      backgroundColor: themeColors.errorLight,
      borderColor: themeColors.error,
      borderRadius: borderRadius.medium,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 14,
      marginTop: 12,
      padding: 14,
    },
  });

export const previewStyles = getPreviewStyles({
  error: colors.error,
  errorLight: colors.errorLight,
  primary: lightColors.primary,
});
