/** DetailViewTabIndicator - Animated card-color pill behind the active tab. */
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { borderRadius, shadows } from '@/theme/spacing';
import { useThemeColors } from '@/theme';
import { PADDING, TABS } from './DetailViewTabs.constants';

interface DetailViewTabIndicatorProps {
  containerWidth: SharedValue<number>;
  indicatorIndex: SharedValue<number>;
}

export function DetailViewTabIndicator({
  containerWidth,
  indicatorIndex,
}: DetailViewTabIndicatorProps) {
  const { colors } = useThemeColors();

  const indicatorStyle = useAnimatedStyle(() => {
    const tabWidth = (containerWidth.value - PADDING * 2) / TABS.length;
    if (tabWidth <= 0) return { opacity: 0 };
    return {
      opacity: 1,
      transform: [{ translateX: PADDING + indicatorIndex.value * tabWidth }],
      width: tabWidth,
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
