import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#b45309',
    fontSize: 12,
    fontWeight: '600',
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    elevation: 3,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  content: {
    padding: 16,
  },
  completedContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    marginVertical: 8,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ecfdf5',
  },
  glow: {
    backgroundColor: '#f59e0b',
    height: 4,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  completedEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  habitHint: {
    color: '#a8a29e',
    fontSize: 13,
  },
  completedSubtitle: {
    color: '#059669',
    fontSize: 13,
  },
  habitIcon: {
    fontSize: 32,
  },
  completedTitle: {
    color: '#065f46',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  habitRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  habitInfo: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  habitName: {
    color: '#1c1917',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  progress: {
    fontSize: 13,
    color: '#a8a29e',
    fontWeight: '500',
  },
});
