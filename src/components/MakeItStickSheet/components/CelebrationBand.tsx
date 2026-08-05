/**
 * CelebrationBand — warm gradient celebration header for the
 * Make-It-Stick sheet (check ring + first-habit headline).
 */

import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../theme/spacing';
import {
  fontFamilies,
  fontWeights,
  typography,
} from '../../../theme/typography';

const BAND_GRADIENT = [
  'rgba(251, 191, 116, 0.55)',
  'rgba(254, 215, 170, 0.30)',
  'rgba(254, 215, 170, 0)',
] as const;

interface CelebrationBandProps {
  topInset: number;
}

export function CelebrationBand({ topInset }: CelebrationBandProps) {
  const { colors } = useThemeColors();

  return (
    <LinearGradient
      colors={BAND_GRADIENT}
      style={{ paddingTop: topInset + 24 }}
    >
      <Animated.View entering={FadeInDown.duration(280)} style={s.band}>
        <View style={[s.checkRing, { backgroundColor: colors.primary[600] }]}>
          <Text style={[s.checkText, { color: colors.text.inverse }]}>✓</Text>
        </View>
        <Text style={[s.bandTitle, { color: colors.text.primary }]}>
          Your first habit is set up.
        </Text>
        <Text style={[s.bandSub, { color: colors.text.secondary }]}>
          Let&apos;s build a streak.
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  band: {
    alignItems: 'center',
    paddingBottom: spacing.base,
    paddingHorizontal: spacing.base,
  },
  bandSub: {
    ...typography.bodySmall,
    marginTop: 2,
  },
  bandTitle: {
    fontFamily: fontFamilies.primary.display,
    fontSize: 22,
    fontWeight: fontWeights.bold,
    marginTop: spacing.md,
  },
  checkRing: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  checkText: {
    fontSize: 26,
    fontWeight: fontWeights.bold,
  },
});
