/**
 * Skeleton loading styles for TemplateScienceModal
 */

import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { borderRadius } from '@/theme/spacing';

export const skeletonStyles = StyleSheet.create({
  skeletonCard: {
    backgroundColor: colors.light.card,
    borderColor: colors.border,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    marginBottom: 16,
    marginHorizontal: 20,
    padding: 20,
  },
  skeletonCardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  skeletonFooter: {
    backgroundColor: colors.light.surfaceMuted,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingBottom: 34,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  skeletonHero: {
    alignItems: 'center',
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  skeletonPillRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
});
