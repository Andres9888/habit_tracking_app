import { ArrowUpDown, ChevronRight, LayoutList } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { durations, enterEasing } from '@/theme/animations';
import { usePressAnimation } from '@/hooks/usePressAnimation';
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

const PressableBase = Animated.createAnimatedComponent(Pressable);

/**
 * SortChip - Card header style row that shows "My Habits" label with sort control.
 *
 * Design specs (Option B - Card Header):
 * - Full width tappable row with rounded corners
 * - Left: List icon + "My Habits" label
 * - Right: Current sort label + chevron
 * - Subtle background (bg-stone-50)
 * - Press animation: scale 0.97 (`usePressAnimation`)
 * - Haptic: selection on commit
 */
export function SortChip({
  sortMode,
  onPress,
  reduceMotion = false,
}: SortChipProps) {
  const { triggerSelection } = useHapticFeedback({});
  const { colors } = useThemeColors();

  // Haptic fires on commit (`handlePress`), not press-in, so a scroll-cancelled
  // touch never buzzes.
  const { animatedStyle, pressHandlers } = usePressAnimation();

  const handlePress = () => {
    triggerSelection();
    onPress();
  };

  const sortLabel = SORT_LABEL_MAP[sortMode];
  const accessibilityLabel = `Sort habits, currently sorted by ${SORT_ACCESSIBILITY_LABEL_MAP[sortMode]}`;

  return (
    <Animated.View
      entering={
        reduceMotion
          ? undefined
          : FadeInDown.delay(durations.instant)
              .duration(durations.enter)
              .easing(enterEasing)
      }
    >
      <PressableBase
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
        {...pressHandlers}
      >
        {/* Left side: icon + label */}
        <View className='flex-row items-center gap-2'>
          <LayoutList
            color={colors.text.secondary}
            size={iconSizes.medium}
            strokeWidth={2}
          />
          <Text
            className='text-sm font-semibold'
            style={{ color: colors.text.primary }}
          >
            My Habits
          </Text>
        </View>

        {/* Right side: sort icon + sort label + chevron */}
        <View className='flex-row items-center gap-1'>
          <ArrowUpDown
            color={colors.text.tertiary}
            size={iconSizes.small}
            strokeWidth={2}
          />
          <Text
            className='text-sm font-normal'
            style={{ color: colors.text.tertiary }}
          >
            {sortLabel}
          </Text>
          <ChevronRight
            color={colors.text.tertiary}
            size={iconSizes.small}
            strokeWidth={2}
          />
        </View>
      </PressableBase>
    </Animated.View>
  );
}

export default SortChip;
