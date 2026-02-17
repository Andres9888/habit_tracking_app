import { StyleSheet } from 'react-native';
import type { SemanticColors } from '@/theme/darkColors';

export const createLayoutStyles = (c: SemanticColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: c.background,
      flex: 1,
    },
    emptyStateWrapper: {
      paddingHorizontal: 32,
      paddingVertical: 24,
    },
    header: {
      paddingBottom: 12,
      paddingHorizontal: 20,
      paddingTop: 56,
    },
    listContent: {
      paddingBottom: 24,
    },
    listWrapper: {
      flex: 1,
      position: 'relative',
    },
    loadingContainer: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    sectionDivider: {
      backgroundColor: c.border,
      height: 1,
      marginVertical: 20,
    },
  });
