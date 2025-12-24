import { ArrowUpDown, Check, ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useHapticFeedback } from '../../../hooks/useHapticFeedback';
import type { HabitSortMode } from '../types';

const SORT_OPTIONS: ReadonlyArray<{ label: string; value: HabitSortMode }> = [
  { label: 'Custom order', value: 'manual' },
  { label: 'Day Phase (Push → Pull)', value: 'day_phase' },
  { label: 'Name (A–Z)', value: 'name_asc' },
  { label: 'Name (Z–A)', value: 'name_desc' },
  { label: 'Strength (low → high)', value: 'strength_asc' },
  { label: 'Strength (high → low)', value: 'strength_desc' },
  { label: 'Streaks (low → high)', value: 'streak_asc' },
  { label: 'Streaks (high → low)', value: 'streak_desc' },
];

interface HabitsSectionHeaderProps {
  habitSortMode: HabitSortMode;
  onChangeHabitSortMode: (value: HabitSortMode) => void;
  habitCount?: number;
}

export function HabitsSectionHeader({
  habitSortMode,
  onChangeHabitSortMode,
  habitCount,
}: HabitsSectionHeaderProps) {
  const { triggerLightImpact, triggerSelection } = useHapticFeedback({});
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Animated value for sort button
  const sortButtonScale = useSharedValue(1);

  const sortButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sortButtonScale.value }],
  }));

  const handleSortPressIn = () => {
    triggerLightImpact();
    sortButtonScale.value = withTiming(0.95, { duration: 50 });
  };

  const handleSortPressOut = () => {
    sortButtonScale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
  };

  const handleSortPress = () => {
    triggerSelection();
    setIsSortDropdownOpen(true);
  };

  const handleSelectSortMode = (value: HabitSortMode) => {
    triggerSelection();
    onChangeHabitSortMode(value);
    setIsSortDropdownOpen(false);
  };

  const habitSortLabel =
    habitSortMode === 'day_phase'
      ? 'Day Phase'
      : habitSortMode === 'name_asc'
        ? 'A–Z'
        : habitSortMode === 'name_desc'
          ? 'Z–A'
          : habitSortMode === 'strength_asc'
            ? 'Strength ↑'
            : habitSortMode === 'strength_desc'
              ? 'Strength ↓'
              : habitSortMode === 'streak_asc'
                ? 'Streaks ↑'
                : habitSortMode === 'streak_desc'
                  ? 'Streaks ↓'
                  : 'Custom';

  const isNonDefaultSort = habitSortMode !== 'manual';

  return (
    <>
      <View className='mb-3 flex-row items-center justify-between px-1'>
        {/* Section Label */}
        <Text className='text-[11px] font-semibold uppercase tracking-wider text-stone-400'>
          My Habits
        </Text>

        {/* Sort Control */}
        <Animated.View style={sortButtonAnimatedStyle}>
          <Pressable
            accessibilityHint='Tap to change habit sort order'
            accessibilityLabel={`Sorted by ${habitSortLabel}`}
            accessibilityRole='button'
            className={`flex-row items-center gap-1.5 rounded-lg px-2 py-1 ${
              isNonDefaultSort
                ? 'border border-amber-200 bg-amber-50'
                : 'bg-stone-100'
            }`}
            onPress={handleSortPress}
            onPressIn={handleSortPressIn}
            onPressOut={handleSortPressOut}
          >
            <ArrowUpDown
              color={isNonDefaultSort ? '#92400e' : '#78716c'}
              size={14}
              strokeWidth={2.25}
            />
            <Text
              className={`text-[12px] font-medium ${
                isNonDefaultSort ? 'text-amber-800' : 'text-stone-600'
              }`}
            >
              {habitSortLabel}
            </Text>
            <ChevronDown
              color={isNonDefaultSort ? '#b45309' : '#a8a29e'}
              size={12}
              strokeWidth={2.5}
            />
          </Pressable>
        </Animated.View>
      </View>

      {/* Sort Options Dropdown Modal */}
      <Modal
        transparent
        animationType='fade'
        visible={isSortDropdownOpen}
        onRequestClose={() => setIsSortDropdownOpen(false)}
      >
        <Pressable
          className='flex-1 items-center justify-center bg-black/40'
          onPress={() => setIsSortDropdownOpen(false)}
        >
          <Pressable
            className='mx-6 w-full max-w-xs rounded-2xl bg-white p-2 shadow-xl'
            onPress={(e) => e.stopPropagation()}
          >
            <Text className='px-4 py-3 text-[13px] font-semibold uppercase tracking-wide text-stone-500'>
              Sort habits by
            </Text>
            {SORT_OPTIONS.map(({ label, value }) => (
              <TouchableOpacity
                key={value}
                activeOpacity={0.7}
                className='flex-row items-center justify-between rounded-xl px-4 py-3 active:bg-stone-100'
                onPress={() => handleSelectSortMode(value)}
              >
                <Text
                  className={`text-[15px] font-medium ${
                    habitSortMode === value
                      ? 'text-amber-700'
                      : 'text-stone-800'
                  }`}
                >
                  {label}
                </Text>
                {habitSortMode === value && (
                  <View className='rounded-full bg-amber-600 p-1'>
                    <Check color='#ffffff' size={12} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
