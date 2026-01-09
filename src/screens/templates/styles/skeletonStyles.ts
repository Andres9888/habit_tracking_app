import { StyleSheet } from 'react-native';

export const skeletonStyles = StyleSheet.create({
  skeletonBadge: {
    backgroundColor: '#e5e7eb',
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
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 20,
  },
  skeletonIcon: {
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    height: 48,
    width: 48,
  },
  skeletonLine: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    height: 12,
    marginTop: 8,
    width: '60%',
  },
  skeletonLineLarge: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    height: 16,
    marginTop: 16,
    width: '80%',
  },
  skeletonSearch: {
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    height: 44,
    marginBottom: 16,
    marginHorizontal: 20,
  },
});
