/**
 * StrengthMeter — animated habit strength visualization for onboarding.
 */

import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { durations, enterEasing } from '../../theme/animations';
import { useThemeColors } from '../../theme/ThemeContext';
import { visualStyles as vs } from './onboarding.visuals.styles';

const STAGES = ['Starting', 'Building', 'Growing', 'Strong', 'Automatic'];

function interpolateColor(t: number, primary: Record<number, string>): string {
  if (t < 0.5) return primary[400];
  if (t < 0.75) return primary[600];
  return primary[700];
}

export function StrengthMeter({ reduceMotion }: { reduceMotion: boolean }) {
  const { colors } = useThemeColors();
  return (
    <View style={vs.strengthContainer}>
      {STAGES.map((stage, i) => (
        <Animated.View
          key={stage}
          entering={
            reduceMotion
              ? undefined
              : FadeInDown.delay(400 + i * 200)
                  .duration(durations.enter)
                  .easing(enterEasing)
          }
          style={vs.strengthRow}
        >
          <View
            style={[
              vs.strengthBar,
              {
                backgroundColor: interpolateColor(i / 4, colors.primary),
                opacity: 0.15 + i * 0.2125,
                width: `${20 + i * 20}%`,
              },
            ]}
          />
          <Text
            style={[
              vs.strengthLabel,
              { color: colors.text.secondary },
              i === 4 && { color: colors.primary[700] },
              i === 4 && vs.strengthLabelActive,
            ]}
          >
            {stage}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
}
