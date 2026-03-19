import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { lightColors } from '../../../theme/darkColors';
import type { SemanticColors } from '../../../theme/darkColors';

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
      fontSize: 34,
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
      borderRadius: 12,
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
      fontSize: 17,
    },
    youtubeIcon: {
      fontSize: 17,
    },
    youtubeIconWrapper: {
      alignItems: 'center',
      backgroundColor: themeColors.error,
      borderRadius: 12,
      height: 40,
      justifyContent: 'center',
      width: 40,
    },
    youtubeLink: {
      alignItems: 'center',
      backgroundColor: themeColors.errorLight,
      borderColor: themeColors.error,
      borderRadius: 12,
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
