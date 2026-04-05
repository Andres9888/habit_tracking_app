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
    fontWeight: fontWeights.semibold,
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
    fontWeight: fontWeights.semibold,
    textAlign: 'center',
  },
  percentageContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  percentageText: {
    fontWeight: fontWeights.bold,
  },
  trendArrow: {
    fontWeight: fontWeights.bold,
    marginLeft: 1,
  },
});
