/** DetailHeroStatValue — streak stat with translateY + fade swap on value change. */
import { Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { durations, enterEasing, exitEasing } from '../../../theme/animations';
import { fontFamilies, fontWeights, typography } from '../../../theme/typography';
import { useThemeColors } from '../../../theme';
import { useReduceMotion } from '../../../hooks/useReduceMotion';

const AnimatedText = Animated.createAnimatedComponent(Text);
const VALUE_HEIGHT = typography.heading3.fontSize + 4;

interface DetailHeroStatValueProps {
  value: number;
}

export function DetailHeroStatValue({ value }: DetailHeroStatValueProps) {
  const { colors } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const entering = reduceMotion
    ? undefined
    : FadeInDown.duration(durations.quick).easing(enterEasing);
  const exiting = reduceMotion
    ? undefined
    : FadeOutUp.duration(durations.quick).easing(exitEasing);

  return (
    <View style={{ height: VALUE_HEIGHT, overflow: 'hidden', alignItems: 'center' }}>
      <AnimatedText
        key={value}
        entering={entering}
        exiting={exiting}
        style={{
          color: colors.text.primary,
          fontFamily: fontFamilies.monospace,
          fontSize: typography.heading3.fontSize,
          fontWeight: fontWeights.bold,
        }}
      >
        {value}
      </AnimatedText>
    </View>
  );
}
