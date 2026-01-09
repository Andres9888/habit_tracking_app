import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  categoryHeader: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  categoryHeaderText: {
    color: '#78716c',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  emojiCell: {
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },
  emojiCellSelected: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  emojiCellWrapper: {
    aspectRatio: 1,
    flex: 1,
  },
  emojiRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  emojiText: {
    fontSize: 28,
  },
  emptyState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateSubtitle: {
    color: '#a8a29e',
    fontSize: 14,
    marginTop: 4,
  },
  emptyStateTitle: {
    color: '#1c1917',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
  gridContent: {
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  placeholderCell: {
    backgroundColor: 'transparent',
    flex: 1,
  },
});
