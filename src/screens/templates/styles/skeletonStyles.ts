import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../../theme/darkColors';

export const createSkeletonStyles = (tc: SemanticColors) =>
  StyleSheet.create({
    skeletonBadge: {
      backgroundColor: tc.skeleton,
      borderRadius: 999,
      height: 14,
      width: 60,
    },
    skeletonBadgeRow: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 12,
    },
    skeletonCard: {
      backgroundColor: tc.skeletonCardBg,
      borderRadius: 16,
      marginHorizontal: 20,
      marginVertical: 8,
      padding: 20,
    },
    skeletonIcon: {
      backgroundColor: tc.skeleton,
      borderRadius: 999,
      height: 48,
      width: 48,
    },
    skeletonLine: {
      backgroundColor: tc.skeleton,
      borderRadius: 8,
      height: 12,
      marginTop: 8,
      width: '60%',
    },
    skeletonLineLarge: {
      backgroundColor: tc.skeleton,
      borderRadius: 8,
      height: 16,
      marginTop: 16,
      width: '80%',
    },
    skeletonSearch: {
      backgroundColor: tc.skeleton,
      borderRadius: 999,
      height: 44,
      marginBottom: 16,
      marginHorizontal: 20,
    },
  });

/** @deprecated Use createSkeletonStyles(themeColors) */
export const skeletonStyles = createSkeletonStyles({
  skeleton: '#e5e7eb', skeletonCardBg: '#fff',
} as any);
