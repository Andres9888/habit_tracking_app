import { ArrowUpDown, ChevronDown } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import type { HabitSortMode } from '../../types';

/**
 * Abbreviated labels for each sort mode, displayed in the chip trigger
 */
const SORT_LABEL_MAP: Record<HabitSortMode, string> = {
  manual: 'Custom',
  day_phase: 'Day Phase',
  name_asc: 'A–Z',
  name_desc: 'Z–A',
  strength_asc: 'Strength ↑',
  strength_desc: 'Strength ↓',
  streak_asc: 'Streak ↑',
  streak_desc: 'Streak ↓',
};

/**
 * Full labels for accessibility announcements
 */
const SORT_ACCESSIBILITY_LABEL_MAP: Record<HabitSortMode, string> = {
  manual: 'Custom order',
  day_phase: 'Day phase',
  name_asc: 'Name A to Z',
  name_desc: 'Name Z to A',
  strength_asc: 'Strength low to high',
  strength_desc: 'Strength high to low',
  streak_asc: 'Streak low to high',
  streak_desc: 'Streak high to low',
};

interface SortChipProps {
  /**
   * Current sort mode
   */
  sortMode: HabitSortMode;
  /**
   * Number of habits to display next to the chip
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
 * SortChip - A compact dark pill button that shows the current sort mode
 * and opens the sort bottom sheet when pressed.
 *
 * Design specs:
 * - Dark pill button (bg-stone-800, white text)
 * - Contains: sort icon + current sort label + chevron
 * - Habit count displayed next to chip
 * - Height: ~32px
 * - Press animation: scale 0.95 with 50ms timing
 * - Release: spring back (damping: 15, stiffness: 300)
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
      buttonScale.value = withTiming(0.95, { duration: 50 });
    }
  };

  const handlePressOut = () => {
    if (!reduceMotion) {
      buttonScale.value = withSpring(1, {
        damping: 15,
        stiffness: 300,
      });
    }
  };

  const handlePress = () => {
    triggerSelection();
    onPress();
  };

  const sortLabel = SORT_LABEL_MAP[sortMode];
  const accessibilityLabel = `Sort habits, currently sorted by ${SORT_ACCESSIBILITY_LABEL_MAP[sortMode]}`;
  const habitCountText = habitCount === 1 ? '1 habit' : `${habitCount} habits`;

  return (
    <View className="flex-row items-center gap-2">
      <AnimatedPressable
        accessibilityHint="Opens sort options"
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        style={animatedStyle}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <LinearGradient
          className="flex-row items-center gap-1.5 rounded-full px-3 py-1.5"
          colors={['#292524', '#1c1917']}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={{
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { height: 1, width: 0 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          }}
        >
          <ArrowUpDown
            color="#ffffff"
            size={14}
            strokeWidth={2.25}
          />
          <Text className="text-[13px] font-medium text-white">
            {sortLabel}
          </Text>
          <ChevronDown
            color="#a8a29e"
            size={12}
            strokeWidth={2.5}
          />
        </LinearGradient>
      </AnimatedPressable>

      {/* Habit count */}
      <Text className="text-[13px] text-stone-400">
        {habitCountText}
      </Text>
    </View>
  );
}

export default SortChip;
