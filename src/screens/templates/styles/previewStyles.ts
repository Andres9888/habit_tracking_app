import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../../theme/darkColors';

export const createPreviewStyles = (tc: SemanticColors) =>
  StyleSheet.create({
    previewActions: {
      marginTop: 32,
    },
    previewCategory: {
      color: tc.previewSubtext,
      marginTop: 6,
    },
    previewHeader: {
      alignItems: 'center',
    },
    previewIcon: {
      fontSize: 48,
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
      borderColor: tc.scienceBorder,
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
      backgroundColor: tc.previewDeleteBg,
      borderRadius: 12,
      height: 40,
      justifyContent: 'center',
      width: 40,
    },
    youtubeLink: {
      alignItems: 'center',
      backgroundColor: tc.previewDeleteConfirmBg,
      borderColor: tc.previewDeleteConfirmBorder,
      borderRadius: 12,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 14,
      marginTop: 12,
      padding: 14,
    },
  });

/** @deprecated Use createPreviewStyles(themeColors) */
export const previewStyles = createPreviewStyles({
  previewSubtext: '#78716c', scienceBorder: '#bbf7d0',
  previewDeleteBg: '#DC2626', previewDeleteConfirmBg: '#FEF2F2',
  previewDeleteConfirmBorder: '#FECACA',
} as any);
