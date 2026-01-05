import { memo, useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

/**
 * Props for ModalHeaderV1 component
 */
interface ModalHeaderV1Props {
  /** Callback when close button is pressed */
  onClose: () => void;
  /** Number of completed sections (0-3) */
  completedSections: number;
  /** Total number of sections (always 3) */
  totalSections: number;
}

/**
 * Modal header with progress tracking for Cards V1 design
 *
 * Displays:
 * - Close button (top-left)
 * - "New Habit" title (centered)
 * - Progress text: "{completedSections} of {totalSections} complete"
 * - Animated progress bar at bottom
 *
 * @component
 * @example
 * ```tsx
 * <ModalHeaderV1
 *   onClose={handleClose}
 *   completedSections={2}
 *   totalSections={3}
 * />
 * ```
 */
const ModalHeaderV1Component = ({
  onClose,
  completedSections,
  totalSections,
}: ModalHeaderV1Props) => {
  // Calculate progress percentage (0-100)
  const progressPercentage = (completedSections / totalSections) * 100;

  // Animated value for progress bar width
  const animatedWidth = useSharedValue(0);

  // Update animated width when progress changes
  useEffect(() => {
    animatedWidth.value = withTiming(progressPercentage, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, [progressPercentage, animatedWidth]);

  // Animated style for progress bar
  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
  }));

  return (
    <View
      accessibilityRole="header"
      className="border-b border-stone-100 bg-white"
    >
      {/* Header content */}
      <View className="flex-row items-center justify-between px-5 py-4">
        {/* Close button */}
        <TouchableOpacity
          accessibilityHint="Close the habit creation modal"
          accessibilityLabel="Close"
          accessibilityRole="button"
          onPress={onClose}
        >
          <X color="#a8a29e" size={24} strokeWidth={2} />
        </TouchableOpacity>

        {/* Title and progress text */}
        <View className="items-center">
          <Text className="text-lg font-semibold text-stone-900">
            New Habit
          </Text>
          <Text className="mt-0.5 text-xs font-medium text-emerald-600">
            {completedSections} of {totalSections} complete
          </Text>
        </View>

        {/* Spacer for centering */}
        <View className="w-6" />
      </View>

      {/* Progress bar */}
      <View
        accessibilityLabel={`Progress: ${completedSections} of ${totalSections} sections complete`}
        accessibilityRole="progressbar"
        accessibilityValue={{
          min: 0,
          max: totalSections,
          now: completedSections,
        }}
        className="h-[3px] bg-stone-200"
      >
        <Animated.View
          className="h-full bg-emerald-500"
          style={progressBarStyle}
        />
      </View>
    </View>
  );
};

/**
 * Memoized ModalHeaderV1 component for performance optimization
 */
export const ModalHeaderV1 = memo(ModalHeaderV1Component);
