/**
 * WeeklySummaryStrip Styles
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    elevation: 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardGradient: {
    borderColor: '#a7f3d0', // emerald-200
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  comparisonText: {
    color: '#78716c', // stone-500
    fontSize: 13,
  },
  container: {
    marginBottom: 12,
  },
  content: {
    padding: 16,
  },
  dayCellContainer: {
    alignItems: 'center',
    flex: 1,
  },
  dayCircle: {
    alignItems: 'center',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  dayCircleRing: {
    elevation: 4,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  dayLabel: {
    color: '#a8a29e', // stone-400
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 6,
  },
  dayPressable: {
    flex: 1,
  },
  daysRow: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  headerRight: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  headerTitle: {
    color: '#1c1917', // stone-900
    fontSize: 16,
    fontWeight: '600',
  },
  perfectBadge: {
    backgroundColor: '#10b981', // emerald-500
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  perfectBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  sparkleContainer: {
    position: 'absolute',
    right: -8,
    top: -4,
  },
  sparkleEmoji: {
    fontSize: 14,
  },
  titleContainer: {
    position: 'relative',
  },
  todayText: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  trendIcon: {
    marginLeft: 2,
  },
});
