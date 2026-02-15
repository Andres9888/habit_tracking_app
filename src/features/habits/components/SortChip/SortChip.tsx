import { ChevronRight, LayoutList } from 'lucide-react-native';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeInDown,
} from 'react-native-reanimated';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import type { HabitSortMode } from '../../types';
import {
  SORT_LABEL_MAP,
  SORT_ACCESSIBILITY_LABEL_MAP,
} from './SortChip.constants';
import { useThemeColors } from '@/theme/ThemeContext';

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
  const { colors } = useThemeColors();
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
        style={[
          animatedStyle,
          styles.container,
          {
            backgroundColor: colors.gray[100],
            borderColor: colors.border,
          },
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Left side: icon + label */}
        <View className='flex-row items-center gap-2'>
          <LayoutList color={colors.text.secondary} size={18} strokeWidth={2} />
          <Text style={[styles.title, { color: colors.text.primary }]}>
            My Habits
          </Text>
        </View>

        {/* Right side: sort label + chevron */}
        <View className='flex-row items-center gap-1'>
          <Text style={[styles.sortLabel, { color: colors.text.secondary }]}>
            {sortLabel}
          </Text>
          <ChevronRight color={colors.text.tertiary} size={16} strokeWidth={2} />
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sortLabel: {
    fontSize: 13,
    fontWeight: '400',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SortChip;
