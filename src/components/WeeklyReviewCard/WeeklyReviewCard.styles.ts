/**
 * WeeklyReviewCard Styles
 *
 * Design system compliant: 16px card radius, SF Pro typography scale,
 * #047857 primary green, 4px shadow offset.
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 0,
    marginBottom: 16,
    // Design system shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    fontSize: 22,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.3,
  },

  // Motivational
  motivational: {
    fontSize: 17,
    fontWeight: '600',
    color: '#047857',
    marginBottom: 16,
  },

  // Big stats row
  bigStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
  },
  bigStat: {
    alignItems: 'center',
    flex: 1,
  },
  bigStatNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#047857',
  },
  bigStatLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748b',
    marginTop: 2,
  },

  // Chart
  chartContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 80,
    paddingHorizontal: 4,
  },
  dayBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  dayBarTrack: {
    width: 24,
    height: 56,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  dayBarFill: {
    backgroundColor: '#059669',
    borderRadius: 6,
    minHeight: 2,
  },
  dayBarPerfect: {
    backgroundColor: '#047857',
  },
  dayBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 4,
  },
  dayBarLabelPerfect: {
    color: '#047857',
    fontWeight: '700',
  },

  // Wins
  winsSection: {
    marginBottom: 12,
    gap: 8,
  },
  winItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  winEmoji: {
    fontSize: 18,
  },
  winText: {
    fontSize: 15,
    color: '#334155',
    flex: 1,
  },
  bold: {
    fontWeight: '700',
  },

  // Detail sections (premium)
  detailSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  habitIcon: {
    fontSize: 18,
    width: 28,
    textAlign: 'center',
  },
  habitName: {
    fontSize: 15,
    color: '#334155',
    flex: 1,
  },
  habitChangePositive: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
  habitChangeNegative: {
    fontSize: 14,
    fontWeight: '700',
    color: '#dc2626',
  },
  streakBadge: {
    fontSize: 13,
    fontWeight: '600',
    color: '#d97706',
  },
  gentleNote: {
    fontSize: 13,
    color: '#64748b',
    fontStyle: 'italic',
    marginTop: 8,
    lineHeight: 18,
  },

  // Upgrade nudge
  upgradeNudge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0fdfa',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#ccfbf1',
  },
  upgradeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0d9488',
    flex: 1,
  },

  // Footer
  footer: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 12,
  },
});
