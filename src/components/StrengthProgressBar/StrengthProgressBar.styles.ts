/**
 * StrengthProgressBar Styles
 *
 * Note: arrow, nextHint, and divider colors are now applied inline
 * via useThemeColors() for dark-mode support. The static values here
 * are fallbacks only.
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  arrow: {
    color: colors.gray[500],
    marginRight: 2,
  },
  barContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
  },
  bottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    width: '100%',
  },
  decayNudge: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  decayText: {
    fontSize: 11,
    fontWeight: '500',
  },
  divider: {
    position: 'absolute',
    top: 0,
    width: 1,
  },
  emoji: {
    textAlign: 'center',
  },
  emojiContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoButton: {
    alignItems: 'center',
    borderRadius: 10,
    height: 20,
    justifyContent: 'center',
    marginLeft: 4,
    width: 20,
  },
  infoText: {
    fontSize: 11,
    fontWeight: '700',
  },
  label: {
    fontWeight: '600',
  },
  nextEmoji: {
    opacity: 0.6,
  },
  nextHint: {
    color: colors.gray[500],
  },
  nextLevelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  percentage: {
    fontWeight: '700',
    minWidth: 32,
    textAlign: 'right',
  },
  tierUpBadge: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tierUpText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tooltipArrow: {
    alignSelf: 'center',
    borderLeftColor: 'transparent',
    borderLeftWidth: 8,
    borderRightColor: 'transparent',
    borderRightWidth: 8,
    borderTopWidth: 8,
    height: 0,
    width: 0,
  },
  tooltipContainer: {
    borderRadius: 12,
    elevation: 8,
    marginTop: 8,
    padding: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  tooltipRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  tooltipSubtext: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 8,
  },
  tooltipTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
