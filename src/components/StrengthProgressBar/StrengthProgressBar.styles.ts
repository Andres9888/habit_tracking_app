/**
 * StrengthProgressBar Styles
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  arrow: {
    color: '#9ca3af',
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
  divider: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
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
  label: {
    fontWeight: '600',
  },
  nextEmoji: {
    opacity: 0.6,
  },
  nextHint: {
    color: '#9ca3af',
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
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
