import { ArrowUpDown, ChevronRight, LayoutList } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import { durations, enterEasing, springs } from '@/theme/animations';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { HabitSortMode } from '../../types';
import {
  SORT_LABEL_MAP,
  SORT_ACCESSIBILITY_LABEL_MAP,
} from './SortChip.constants';

interface SortChipProps {
  /**
   * Current sort mode
   */
  sortMode: HabitSortMode;
  /**
   * Number of habits to display
   */
  habitCount: number;
  /**
   * Callback when the chip is pressed to open sort options
   */
  onPress: () => void;
  /**
   * Optional reduce motion preference for animations
   */
  reduceMotion?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * SortChip - Card header style row that shows "My Habits" label with sort control.
 *
 * Design specs (Option B - Card Header):
 * - Full width tappable row with rounded corners
 * - Left: List icon + "My Habits" label
 * - Right: Current sort label + chevron
 * - Subtle background (bg-stone-50)
 * - Press animation: scale 0.98
 * - Haptic: light impact on press
 */
export function SortChip({
  sortMode,
  onPress,
  reduceMotion = false,
}: SortChipProps) {
  const { triggerLightImpact, triggerSelection } = useHapticFeedback({});
  const { colors } = useThemeColors();

  // Animated value for button press scale
  const buttonScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = () => {
    triggerLightImpact();
    if (!reduceMotion) {
      buttonScale.value = withSpring(0.98, springs.button);
    }
  };

  const handlePressOut = () => {
    if (!reduceMotion) {
      buttonScale.value = withSpring(1, springs.button);
    }
  };

  const handlePress = () => {
    triggerSelection();
    onPress();
  };

  const sortLabel = SORT_LABEL_MAP[sortMode];
  const accessibilityLabel = `Sort habits, currently sorted by ${SORT_ACCESSIBILITY_LABEL_MAP[sortMode]}`;

  return (
    <Animated.View
      entering={
        reduceMotion ? undefined : FadeInDown.delay(100).duration(durations.enter).easing(enterEasing)
      }
    >
      <AnimatedPressable
        accessibilityHint='Opens sort options'
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='button'
        className='flex-row items-center justify-between rounded-xl px-4 py-3'
        style={[
          animatedStyle,
          {
            backgroundColor: colors.gray[50],
            borderColor: colors.border,
            borderWidth: 1,
          },
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Left side: icon + label */}
        <View className='flex-row items-center gap-2'>
          <LayoutList color={colors.text.secondary} size={iconSizes.medium} strokeWidth={2} />
          <Text className='text-sm font-semibold' style={{ color: colors.text.primary }}>
            My Habits
          </Text>
        </View>

        {/* Right side: sort icon + sort label + chevron */}
        <View className='flex-row items-center gap-1'>
          <ArrowUpDown color={colors.text.tertiary} size={iconSizes.small} strokeWidth={2} />
          <Text className='text-sm font-normal' style={{ color: colors.text.tertiary }}>
            {sortLabel}
          </Text>
          <ChevronRight color={colors.text.tertiary} size={iconSizes.small} strokeWidth={2} />
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default SortChip;
