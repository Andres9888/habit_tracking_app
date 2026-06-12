/** TimeRangeSegment — single pill segment with detail-page press-scale feedback. */
import { Pressable, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { useDetailPressAnimation } from '@/hooks/useDetailPressAnimation';
import type { TimeRange } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TimeRangeSegmentProps {
  isSelected: boolean;
  label: string;
  segmentWidth: number;
  textPrimary: string;
  textSecondary: string;
  value: TimeRange;
  onPress: (value: TimeRange) => void;
}

export function TimeRangeSegment({
  isSelected,
  label,
  segmentWidth,
  textPrimary,
  textSecondary,
  value,
  onPress,
}: TimeRangeSegmentProps) {
  const { animatedStyle, pressHandlers } = useDetailPressAnimation();

  return (
    <AnimatedPressable
      accessibilityLabel={`${label} time range`}
      accessibilityRole='tab'
      accessibilityState={{ selected: isSelected }}
      hitSlop={{ top: 8, bottom: 8 }}
      style={[
        animatedStyle,
        {
          alignItems: 'center',
          height: 28,
          justifyContent: 'center',
          width: segmentWidth,
        },
      ]}
      onPress={() => onPress(value)}
      onPressIn={pressHandlers.onPressIn}
      onPressOut={pressHandlers.onPressOut}
    >
      <Text
        className='text-xs font-semibold'
        style={{ color: isSelected ? textPrimary : textSecondary }}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}
