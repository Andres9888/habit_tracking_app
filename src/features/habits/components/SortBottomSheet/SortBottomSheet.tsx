import {
  ArrowDownAZ,
  ArrowUpAZ,
  Flame,
  GripVertical,
  Sun,
  Zap,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect } from 'react';

import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import type { HabitSortMode } from '../../types';
import { SortOptionRow } from './SortOptionRow';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Spring configuration for bottom sheet animations
 * Using softer, more organic spring matching app's FadeInDown.springify().damping(18) pattern
 */
const SHEET_SPRING_CONFIG = {
  damping: 18,
  stiffness: 120,
  mass: 1,
};

/**
 * Sort option configuration with icons, colors, and descriptions
 */
interface SortOptionConfig {
  value: HabitSortMode;
  label: string;
  description: string;
  Icon: LucideIcon;
  iconBgColors: [string, string];
  /** Quick chip label (shorter version) */
  chipLabel?: string;
}

const SORT_OPTIONS: SortOptionConfig[] = [
  {
    value: 'manual',
    label: 'Custom Order',
    description: 'Drag to reorder manually',
    Icon: GripVertical,
    iconBgColors: ['#78716c', '#57534e'], // stone
    chipLabel: 'Custom',
  },
  {
    value: 'day_phase',
    label: 'Day Phase',
    description: 'Push → Pivot → Pull',
    Icon: Sun,
    iconBgColors: ['#fbbf24', '#f97316'], // amber→orange
    chipLabel: 'Day Phase',
  },
  {
    value: 'name_asc',
    label: 'Name (A–Z)',
    description: 'Alphabetical order',
    Icon: ArrowDownAZ,
    iconBgColors: ['#78716c', '#57534e'], // stone
    chipLabel: 'A-Z',
  },
  {
    value: 'name_desc',
    label: 'Name (Z–A)',
    description: 'Reverse alphabetical',
    Icon: ArrowUpAZ,
    iconBgColors: ['#78716c', '#57534e'], // stone
  },
  {
    value: 'strength_asc',
    label: 'Strength (Low → High)',
    description: 'Focus on habits that need attention',
    Icon: Zap,
    iconBgColors: ['#34d399', '#14b8a6'], // emerald→teal
    chipLabel: 'Strength',
  },
  {
    value: 'strength_desc',
    label: 'Strength (High → Low)',
    description: 'See your strongest habits first',
    Icon: Zap,
    iconBgColors: ['#34d399', '#14b8a6'], // emerald→teal
  },
  {
    value: 'streak_asc',
    label: 'Streaks (Low → High)',
    description: 'Protect habits at risk',
    Icon: Flame,
    iconBgColors: ['#ef4444', '#f97316'], // red→orange
    chipLabel: 'Streak',
  },
  {
    value: 'streak_desc',
    label: 'Streaks (High → Low)',
    description: 'Celebrate your best streaks',
    Icon: Flame,
    iconBgColors: ['#ef4444', '#f97316'], // red→orange
  },
];

/**
 * Quick pick chips - a subset of options for fast access
 */
const QUICK_PICK_OPTIONS = SORT_OPTIONS.filter((opt) => opt.chipLabel);

interface SortBottomSheetProps {
  /**
   * Whether the sheet is visible
   */
  visible: boolean;
  /**
   * Callback when the sheet should close
   */
  onClose: () => void;
  /**
   * Current sort mode
   */
  sortMode: HabitSortMode;
  /**
   * Callback when a sort mode is selected
   */
  onSelectSortMode: (mode: HabitSortMode) => void;
  /**
   * Optional reduce motion preference
   */
  reduceMotion?: boolean;
}

/**
 * SortBottomSheet - iOS-style bottom sheet for selecting habit sort order.
 *
 * Features:
 * - Drag handle for visual affordance
 * - Header with "Sort Habits" title and "Done" button
 * - Quick pick chips for common sort options
 * - Detailed options list with icons and descriptions
 * - Spring animations for slide up/down
 * - Backdrop fade to 40% black
 * - Dismiss via tap outside, drag down, or Done button
 * - Haptic feedback on selection
 * - Full accessibility support
 */
export function SortBottomSheet({
  visible,
  onClose,
  sortMode,
  onSelectSortMode,
  reduceMotion = false,
}: SortBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const { triggerSelection, triggerLightImpact } = useHapticFeedback({});

  // Animation values
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  // Gesture threshold for dismissal
  const DISMISS_THRESHOLD = 100;
  const VELOCITY_THRESHOLD = 800;

  // Handle visibility changes
  useEffect(() => {
    if (visible) {
      // Slide up with spring
      backdropOpacity.value = reduceMotion
        ? 0.4
        : withTiming(0.4, { duration: 300, easing: Easing.out(Easing.cubic) });
      translateY.value = reduceMotion ? 0 : withSpring(0, SHEET_SPRING_CONFIG);
    } else {
      // Slide down
      backdropOpacity.value = reduceMotion
        ? 0
        : withTiming(0, { duration: 250, easing: Easing.in(Easing.cubic) });
      translateY.value = reduceMotion
        ? SCREEN_HEIGHT
        : withSpring(SCREEN_HEIGHT, SHEET_SPRING_CONFIG);
    }
  }, [visible, reduceMotion]);

  // Pan gesture for drag-to-dismiss
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      // Use Math.round on velocity to avoid precision loss error in Reanimated
      const velocityY = Math.round(event.velocityY);
      if (
        event.translationY > DISMISS_THRESHOLD ||
        velocityY > VELOCITY_THRESHOLD
      ) {
        translateY.value = withSpring(SCREEN_HEIGHT, SHEET_SPRING_CONFIG);
        runOnJS(triggerLightImpact)();
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, SHEET_SPRING_CONFIG);
      }
    });

  // Animated styles
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Handle sort selection
  const handleSelectSort = (mode: HabitSortMode) => {
    triggerSelection();
    onSelectSortMode(mode);
    onClose();
  };

  // Handle backdrop press
  const handleBackdropPress = () => {
    triggerLightImpact();
    onClose();
  };

  // Handle Done button press
  const handleDonePress = () => {
    triggerLightImpact();
    onClose();
  };

  return (
    <Modal
      statusBarTranslucent
      transparent
      animationType="none"
      visible={visible}
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
    >
      <View className="flex-1 justify-end">
        {/* Backdrop */}
        <Pressable
          accessible={false}
          className="absolute inset-0"
          onPress={handleBackdropPress}
        >
          <Animated.View
            className="flex-1 bg-black"
            style={backdropStyle}
          />
        </Pressable>

        {/* Sheet container */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            className="rounded-t-3xl bg-white"
            style={[
              {
                maxHeight: SCREEN_HEIGHT * 0.85,
                paddingBottom: insets.bottom + 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
                elevation: 20,
              },
              sheetStyle,
            ]}
          >
            {/* Drag handle */}
            <View className="items-center py-3">
              <View className="h-1 w-10 rounded-full bg-stone-300" />
            </View>

            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pb-4">
              <Text className="text-[17px] font-bold text-stone-900">
                Sort Habits
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Done"
                accessibilityHint="Close sort options"
                className="rounded-lg px-3 py-1.5 active:bg-stone-100"
                onPress={handleDonePress}
              >
                <Text className="text-[14px] font-semibold text-amber-600">
                  Done
                </Text>
              </Pressable>
            </View>

            {/* Quick pick chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4"
              contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
            >
              {QUICK_PICK_OPTIONS.map((option) => {
                const isSelected = sortMode === option.value;
                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: isSelected }}
                    accessibilityLabel={option.chipLabel}
                    className={`flex-row items-center gap-1.5 rounded-full px-4 py-2 ${
                      isSelected
                        ? 'bg-stone-800'
                        : 'bg-stone-100 active:bg-stone-200'
                    }`}
                    onPress={() => handleSelectSort(option.value)}
                  >
                    <option.Icon
                      color={isSelected ? '#ffffff' : '#44403c'}
                      size={14}
                      strokeWidth={2.25}
                    />
                    <Text
                      className={`text-[13px] font-medium ${
                        isSelected ? 'text-white' : 'text-stone-700'
                      }`}
                    >
                      {option.chipLabel}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Detailed options list */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              className="px-4"
            >
              {SORT_OPTIONS.map((option) => (
                <SortOptionRow
                  key={option.value}
                  Icon={option.Icon}
                  iconBgColors={option.iconBgColors}
                  title={option.label}
                  description={option.description}
                  selected={sortMode === option.value}
                  onPress={() => handleSelectSort(option.value)}
                />
              ))}
            </ScrollView>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

export default SortBottomSheet;
