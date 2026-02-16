/**
 * Skeleton loading styles for TemplateScienceModal
 */

import { StyleSheet } from 'react-native';

export const skeletonStyles = StyleSheet.create({
  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#e7e5e4',
    borderRadius: 16,
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
    backgroundColor: '#FAFAF9',
    borderTopColor: '#e7e5e4',
    borderTopWidth: 1,
    paddingBottom: 34,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  skeletonHero: {
    alignItems: 'center',
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  skeletonPillRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
});
