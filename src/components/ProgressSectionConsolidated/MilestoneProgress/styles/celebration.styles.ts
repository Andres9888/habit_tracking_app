import { StyleSheet } from 'react-native';

export const celebrationStyles = StyleSheet.create({
  celebrationContainer: {
    alignItems: 'center',
    backgroundColor: '#fefce8', // amber-50
    borderColor: '#fbbf24', // amber-400
    borderWidth: 1,
  },
  celebrationContent: {
    alignItems: 'center',
    padding: 8,
  },
  celebrationEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  celebrationSubtext: {
    color: '#92400e', // amber-800
    fontSize: 13,
    fontWeight: '500',
  },
  celebrationTitle: {
    color: '#78350f', // amber-900
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  nextMilestoneText: {
    color: '#92400e', // amber-800
    fontSize: 12,
    marginTop: 8,
  },
});
