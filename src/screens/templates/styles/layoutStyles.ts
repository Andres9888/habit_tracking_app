import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../../theme/darkColors';

export const createLayoutStyles = (tc: SemanticColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: tc.layoutBg,
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
      backgroundColor: tc.layoutDivider,
      height: 1,
      marginVertical: 20,
    },
  });

/** @deprecated Use createLayoutStyles(themeColors) */
export const layoutStyles = createLayoutStyles({
  layoutBg: '#FAF8F5', layoutDivider: '#e5e7eb',
} as any);
