/**
 * HeroTitle - Bold 34px question at top of Create Habit modal
 * Per spec: 34px, 700 weight, centered, line-height 1.2, letter-spacing -2%
 */

import { Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface HeroTitleProps {
  text?: string;
}

export const HeroTitle = ({
  text = 'What habit do you want to build?',
}: HeroTitleProps) => (
  <Animated.View
    className='mb-6 px-4'
    entering={FadeInDown.duration(240).delay(100)}
  >
    <Text
      accessibilityRole='header'
      className='text-center font-bold text-stone-900'
      style={{ fontSize: 34, letterSpacing: -34 * 0.02, lineHeight: 34 * 1.2 }}
    >
      {text}
    </Text>
  </Animated.View>
);
