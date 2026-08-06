import { Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { typography } from '@/theme/typography';
import { useThemeColors } from '@/theme/ThemeContext';
import type { LayoutChangeEvent } from 'react-native';

interface DisabledHintProps {
  hintStyle: ReturnType<
    typeof import('react-native-reanimated').useAnimatedStyle
  >;
  onLayout: (event: LayoutChangeEvent) => void;
  pointerEvents: 'auto' | 'none';
}

export function DisabledHint({
  hintStyle,
  onLayout,
  pointerEvents,
}: DisabledHintProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <Animated.View
      className='px-4 py-3'
      pointerEvents={pointerEvents}
      style={hintStyle}
      onLayout={onLayout}
    >
      <Text
        style={{
          ...typography.caption,
          lineHeight: 18,
          color: themeColors.text.secondary,
        }}
      >
        Get a reminder if you haven't completed a habit with an active chain by
        your chosen time.
      </Text>
    </Animated.View>
  );
}
