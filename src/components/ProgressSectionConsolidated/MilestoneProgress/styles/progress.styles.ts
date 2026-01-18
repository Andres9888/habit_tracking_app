import { StyleSheet } from 'react-native';

export const progressStyles = StyleSheet.create({
  badgeIcon: {
    fontSize: 18,
    marginLeft: 4,
  },
  container: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb', // gray-200
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
    padding: 12,
  },
  daysAway: {
    color: '#6b7280', // gray-500
    fontSize: 13,
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerTitle: {
    color: '#1f2937', // gray-800
    fontSize: 15,
    fontWeight: '600',
  },
  milestoneName: {
    color: '#9ca3af', // gray-400
    fontSize: 12,
    marginBottom: 12,
  },
  progressBadge: {
    alignItems: 'center',
    backgroundColor: '#fef3c7', // amber-100
    borderColor: '#fbbf24', // amber-400
    borderRadius: 12,
    borderWidth: 1,
    height: 24,
    justifyContent: 'center',
    marginLeft: 8,
    width: 24,
  },
  progressBadgeText: {
    fontSize: 12,
  },
  progressBarContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  progressBarFill: {
    backgroundColor: '#f59e0b', // amber-500
    borderRadius: 4,
    height: '100%',
  },
  progressBarTrack: {
    backgroundColor: '#e5e7eb', // gray-200
    borderRadius: 4,
    flex: 1,
    height: 8,
    overflow: 'hidden',
  },
  progressLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  progressLabelText: {
    color: '#9ca3af', // gray-400
    fontSize: 11,
  },
});
