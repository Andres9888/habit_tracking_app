/**
 * Element Styles
 *
 * Styles for individual UI elements in TodaysFocusCard.
 */

import { StyleSheet } from 'react-native';

export const elementStyles = StyleSheet.create({
  badgeContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  badgeEmoji: {
    fontSize: 32,
    textAlign: 'center',
  },
  celebrationContent: {
    gap: 2,
  },
  celebrationSubtext: {
    fontSize: 14,
    fontWeight: '500',
  },
  confettiContainer: {
    height: 0,
    left: '50%',
    pointerEvents: 'none',
    position: 'absolute',
    top: '50%',
    width: 0,
    zIndex: 100,
  },
  confettiParticle: {
    elevation: 2,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  dismissButton: {
    alignItems: 'center',
    paddingBottom: 12,
    paddingTop: 4,
  },
  dismissText: {
    fontSize: 12,
    fontWeight: '500',
  },
  goalLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  goalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  goalValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  nextMilestone: {
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.85,
  },
  shareButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});
