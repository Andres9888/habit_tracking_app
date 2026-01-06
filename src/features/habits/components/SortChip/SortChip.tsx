import { ChevronRight, LayoutList } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeInDown,
} from 'react-native-reanimated';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import type { HabitSortMode } from '../../types';

/**
 * Abbreviated labels for each sort mode, displayed in the chip trigger
 */
const SORT_LABEL_MAP: Record<HabitSortMode, string> = {
  day_phase: 'Day Phase',
  manual: 'Custom',
  name_asc: 'A–Z',
  name_desc: 'Z–A',
  streak_asc: 'Streak ↑',
  streak_desc: 'Streak ↓',
  strength_asc: 'Strength ↑',
  strength_desc: 'Strength ↓',
};

/**
 * Full labels for accessibility announcements
 */
const SORT_ACCESSIBILITY_LABEL_MAP: Record<HabitSortMode, string> = {
  day_phase: 'Day phase',
  manual: 'Custom order',
  name_asc: 'Name A to Z',
  name_desc: 'Name Z to A',
  streak_asc: 'Streak low to high',
  streak_desc: 'Streak high to low',
  strength_asc: 'Strength low to high',
  strength_desc: 'Strength high to low',
};

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
  habitCount,
  onPress,
  reduceMotion = false,
}: SortChipProps) {
  const { triggerLightImpact, triggerSelection } = useHapticFeedback({});

  // Animated value for button press scale
  const buttonScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = () => {
    triggerLightImpact();
    if (!reduceMotion) {
      buttonScale.value = withTiming(0.98, { duration: 80 });
    }
  };

  const handlePressOut = () => {
    if (!reduceMotion) {
      buttonScale.value = withSpring(1, {
        damping: 18,
        stiffness: 200,
      });
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
        reduceMotion ? undefined : FadeInDown.delay(100).springify().damping(18)
      }
    >
      <AnimatedPressable
        accessibilityHint='Opens sort options'
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='button'
        className='flex-row items-center justify-between rounded-xl bg-stone-50 px-4 py-3 active:bg-stone-100'
        style={[
          animatedStyle,
          {
            borderColor: '#e7e5e4',
            borderWidth: 1, // stone-200
          },
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Left side: icon + label */}
        <View className='flex-row items-center gap-2'>
          <LayoutList color='#78716c' size={18} strokeWidth={2} />
          <Text className='text-[14px] font-semibold text-stone-700'>
            My Habits
          </Text>
        </View>

        {/* Right side: sort label + chevron */}
        <View className='flex-row items-center gap-1'>
          <Text className='text-[13px] font-normal text-stone-500'>
            {sortLabel}
          </Text>
          <ChevronRight color='#a8a29e' size={16} strokeWidth={2} />
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default SortChip;
