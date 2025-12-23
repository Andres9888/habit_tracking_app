import { ArrowUpDown, Check, Lightbulb, Plus, Settings } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useHapticFeedback } from '../../../hooks/useHapticFeedback';
import { TemplateTooltip } from '../../../components/templates/TemplateTooltip/TemplateTooltip';
import { NotificationBadge } from '../../../components/ui/NotificationBadge/NotificationBadge';
import { useTemplateTooltip } from '../hooks/useTemplateTooltip';
import { useTemplateBadge } from '../hooks/useTemplateBadge';
import { DailyMomentumMeter } from '../../../components/DailyMomentumMeter';
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

interface HabitsHeaderProps {
  completedToday?: number;
  habitSortMode?: HabitSortMode;
  onChangeHabitSortMode: (value: HabitSortMode) => void;
  openCreateHabitScreen: () => void;
  openSettings: () => void;
  openTemplatesScreen: () => void;
  reduceMotion?: boolean;
  showCompletionSummary?: boolean;
  totalHabits?: number;
}

export function HabitsHeader({
  completedToday = 0,
  habitSortMode = 'manual',
  onChangeHabitSortMode,
  openCreateHabitScreen,
  openSettings,
  openTemplatesScreen,
  reduceMotion = false,
  showCompletionSummary = true,
  totalHabits = 0,
}: HabitsHeaderProps) {
  const { triggerLightImpact, triggerSelection } = useHapticFeedback({});
  const { dismissTooltip, showTooltip } = useTemplateTooltip();
  const { showBadge, dismissBadge } = useTemplateBadge({ totalHabits });

  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Animated values for the main "Add Habit" button
  const addButtonScale = useSharedValue(1);

  // Animated values for icon buttons
  const templatesButtonScale = useSharedValue(1);
  const settingsButtonScale = useSharedValue(1);
  const sortButtonScale = useSharedValue(1);

  const addButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addButtonScale.value }],
  }));

  const templatesButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: templatesButtonScale.value }],
  }));

  const settingsButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: settingsButtonScale.value }],
  }));

  const sortButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sortButtonScale.value }],
  }));

  const handleAddHabitPressIn = () => {
    triggerLightImpact();
    addButtonScale.value = withTiming(0.95, { duration: 50 });
  };

  const handleAddHabitPressOut = () => {
    addButtonScale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
  };

  const handleAddHabitPress = () => {
    triggerSelection();
    openCreateHabitScreen();
  };

  const handleTemplatesPressIn = () => {
    triggerLightImpact();
    templatesButtonScale.value = withTiming(0.9, { duration: 50 });
  };

  const handleTemplatesPressOut = () => {
    templatesButtonScale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
  };

  const handleTemplatesPress = () => {
    triggerSelection();
    dismissBadge(); // Dismiss badge when user clicks templates
    openTemplatesScreen();
  };

  const handleSettingsPressIn = () => {
    triggerLightImpact();
    settingsButtonScale.value = withTiming(0.9, { duration: 50 });
  };

  const handleSettingsPressOut = () => {
    settingsButtonScale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
  };

  const handleSettingsPress = () => {
    triggerSelection();
    openSettings();
  };

  const handleSortPressIn = () => {
    triggerLightImpact();
    sortButtonScale.value = withTiming(0.9, { duration: 50 });
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
                  : 'Sort';

  // Calculate completion percentage for accessibility
  const percentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  // Smart Empty State - hide header completely when user has no habits
  // Let HabitsEmptyState component handle the full onboarding experience
  if (totalHabits === 0) {
    return null;
  }

  // Regular header when user has habits
  return (
    <View className='gap-2'>
      <View className='flex-row items-center justify-between'>
        <Animated.View style={addButtonAnimatedStyle}>
        <Pressable
          accessibilityHint='Open create habit modal'
          accessibilityLabel='Add habit'
          accessibilityRole='button'
          onPress={handleAddHabitPress}
          onPressIn={handleAddHabitPressIn}
          onPressOut={handleAddHabitPressOut}
        >
          <LinearGradient
            colors={['#101828', '#1a2332']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className='h-12 flex-row items-center gap-2 rounded-full px-5'
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 6,
              elevation: 4,
            }}
          >
            <Plus color='#ffffff' size={18} strokeWidth={2.25} />
            <Text className='text-[15px] font-normal leading-[20px] tracking-tight text-white'>
              Add Habit
            </Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>

      <View className='flex-row gap-3'>
        <Animated.View style={templatesButtonAnimatedStyle}>
          <View style={{ position: 'relative' }}>
            <Pressable
              accessibilityHint='Discover science-backed habits to add'
              accessibilityLabel='Discover Habits'
              accessibilityRole='button'
              className='h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white/60'
              onPress={handleTemplatesPress}
              onPressIn={handleTemplatesPressIn}
              onPressOut={handleTemplatesPressOut}
            >
              <Lightbulb color='#f59e0b' size={18} strokeWidth={2.25} />
            </Pressable>

            {/* Smart notification badge */}
            <NotificationBadge visible={showBadge} count={1} />
          </View>

          {/* First-time user tooltip */}
          <TemplateTooltip visible={showTooltip} onDismiss={dismissTooltip} />
        </Animated.View>

        <Animated.View style={sortButtonAnimatedStyle}>
          <Pressable
            accessibilityHint='Tap to change habit sort order'
            accessibilityLabel={habitSortMode === 'manual' ? 'Sort habits' : `Sorted by ${habitSortLabel}`}
            accessibilityRole='button'
            className={`h-9 flex-row items-center gap-1.5 rounded-full border ${
              habitSortMode === 'manual'
                ? 'w-9 justify-center border-stone-200 bg-white/60'
                : 'border-amber-200 bg-amber-50/70 px-3'
            }`}
            onPress={handleSortPress}
            onPressIn={handleSortPressIn}
            onPressOut={handleSortPressOut}
          >
            <ArrowUpDown
              color={habitSortMode === 'manual' ? '#44403c' : '#92400e'}
              size={16}
              strokeWidth={2.25}
            />
            {habitSortMode !== 'manual' && (
              <Text className='text-[13px] font-semibold text-amber-800'>
                {habitSortLabel}
              </Text>
            )}
          </Pressable>
        </Animated.View>

        <Animated.View style={settingsButtonAnimatedStyle}>
          <Pressable
            accessibilityLabel='Open settings'
            accessibilityRole='button'
            className='h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white/60'
            onPress={handleSettingsPress}
            onPressIn={handleSettingsPressIn}
            onPressOut={handleSettingsPressOut}
          >
            <Settings color='#44403c' size={20} strokeWidth={2.25} />
          </Pressable>
        </Animated.View>
      </View>
      </View>

      {/* Daily Momentum Meter */}
      {showCompletionSummary && (
        <View
          accessibilityRole='text'
          accessibilityLabel={`Today ${completedToday} of ${totalHabits} complete, ${percentage} percent`}
        >
          <DailyMomentumMeter
            completedToday={completedToday}
            reduceMotion={reduceMotion}
            size='standard'
            totalHabits={totalHabits}
          />
        </View>
      )}

      {/* Sort Options Dropdown Modal */}
      <Modal
        animationType='fade'
        transparent
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
                    habitSortMode === value ? 'text-amber-700' : 'text-stone-800'
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
    </View>
  );
}
