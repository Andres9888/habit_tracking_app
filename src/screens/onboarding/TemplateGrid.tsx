/**
 * TemplateGrid — animated emoji grid for onboarding templates page.
 */

import { View, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
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
  return (
    <View style={vs.templateGrid}>
      {TEMPLATE_ICONS.map((emoji, i) => (
        <Animated.View
          key={i}
          entering={
            reduceMotion
              ? undefined
              : FadeIn.delay(300 + i * 60)
                  .springify()
                  .damping(18)
          }
          style={vs.templateItem}
        >
          <Text style={vs.templateEmoji}>{emoji}</Text>
        </Animated.View>
      ))}
    </View>
  );
}
