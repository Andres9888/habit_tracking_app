/**
 * StrengthProgressBar Styles
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { fontWeights } from '@/theme/typography';

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
    fontWeight: fontWeights.semibold,
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
    fontWeight: fontWeights.bold,
    minWidth: 32,
    textAlign: 'right',
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
