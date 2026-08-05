/**
 * TemplateGrid — animated emoji grid for onboarding templates page.
 */

import { View, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { durations, enterEasing } from '../../theme/animations';
import { useThemeColors } from '../../theme/ThemeContext';
import { visualStyles as vs } from './onboarding.visuals.styles';

const TEMPLATE_ICONS = [
  '🧘',
  '💧',
  '📖',
  '🏃',
  '😴',
  '🥗',
  '✍️',
  '🧠',
  '💊',
  '🎯',
  '🌅',
  '🏋️',
];

export function TemplateGrid({ reduceMotion }: { reduceMotion: boolean }) {
  const { colors } = useThemeColors();

  return (
    <View style={vs.templateGrid}>
      {TEMPLATE_ICONS.map((emoji, i) => (
        <Animated.View
          key={i}
          entering={
            reduceMotion
              ? undefined
              : FadeIn.delay(300 + i * 60)
                  .duration(durations.enter)
                  .easing(enterEasing)
          }
          style={[
            vs.templateItem,
            {
              backgroundColor: colors.primary[100],
              borderColor: colors.cardBorder,
              borderWidth: 1,
            },
          ]}
        >
          <Text style={vs.templateEmoji}>{emoji}</Text>
        </Animated.View>
      ))}
    </View>
  );
}
