import { StyleSheet } from 'react-native';
import type { SemanticColors } from '@/theme/darkColors';

export const createPreviewStyles = (c: SemanticColors) =>
  StyleSheet.create({
    previewActions: {
      marginTop: 32,
    },
    previewCategory: {
      color: c.text.tertiary,
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
      borderColor: c.primary[300],
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
      backgroundColor: '#DC2626',
      borderRadius: 12,
      height: 40,
      justifyContent: 'center',
      width: 40,
    },
    youtubeLink: {
      alignItems: 'center',
      backgroundColor: c.gray[50],
      borderColor: c.border,
      borderRadius: 12,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 14,
      marginTop: 12,
      padding: 14,
    },
  });
