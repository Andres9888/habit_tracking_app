/** RangeToggleIndicator - animated card-color pill behind the active segment. */
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { borderRadius, shadows } from '@/theme/spacing';
import { useThemeColors } from '@/theme';
import { TIME_RANGE_OPTIONS } from '../constants';
import { PADDING } from './RangeToggle.constants';

interface RangeToggleIndicatorProps {
  containerWidth: SharedValue<number>;
  indicatorIndex: SharedValue<number>;
}

export function RangeToggleIndicator({
  containerWidth,
  indicatorIndex,
}: RangeToggleIndicatorProps) {
  const { colors } = useThemeColors();

  const indicatorStyle = useAnimatedStyle(() => {
    const segmentWidth =
      (containerWidth.value - PADDING * 2) / TIME_RANGE_OPTIONS.length;
    if (segmentWidth <= 0) return { opacity: 0 };
    return {
      opacity: 1,
      transform: [
        { translateX: PADDING + indicatorIndex.value * segmentWidth },
      ],
      width: segmentWidth,
    };
  });

  return (
    <Animated.View
      pointerEvents='none'
      style={[
        {
          ...shadows.subtle,
          backgroundColor: colors.card,
          borderRadius: borderRadius.full,
          bottom: PADDING,
          position: 'absolute',
          top: PADDING,
        },
        indicatorStyle,
      ]}
    />
  );
}
