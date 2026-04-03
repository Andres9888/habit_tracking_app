/**
 * StrengthRing Styles
 */
import { StyleSheet } from 'react-native';
import { fontWeights } from '@/theme/typography';

export const styles = StyleSheet.create({
  centerText: {
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    top: 0,
  },
  changeText: {
    fontWeight: '600',
    marginLeft: 4,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    textAlign: 'center',
  },
  levelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
  levelEmoji: {
    marginRight: 2,
  },
  levelText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  percentageContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  percentageText: {
    fontWeight: '700',
  },
  trendArrow: {
    fontWeight: fontWeights.bold,
    marginLeft: 1,
  },
});
