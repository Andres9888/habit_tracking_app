import { ArrowUpDown, BookOpen, Plus, Settings } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useHapticFeedback } from '../../../hooks/useHapticFeedback';
import { TemplateTooltip } from '../../../components/TemplateTooltip';
import { NotificationBadge } from '../../../components/NotificationBadge';
import { useTemplateTooltip } from '../hooks/useTemplateTooltip';
import { useTemplateBadge } from '../hooks/useTemplateBadge';
import { DailyMomentumMeter } from '../../../components/DailyMomentumMeter';

interface HabitsHeaderProps {
  completedToday?: number;
  /** Force show header even when totalHabits is 0 (used during empty->list transition) */
  forceShow?: boolean;
  openCreateHabitScreen: () => void;
  openSettings: () => void;
  openSortSheet: () => void;
  openTemplatesScreen: () => void;
  reduceMotion?: boolean;
  showCompletionSummary?: boolean;
  totalHabits?: number;
}

export function HabitsHeader({
  completedToday = 0,
  forceShow = false,
  openCreateHabitScreen,
  openSettings,
  openSortSheet,
  openTemplatesScreen,
  reduceMotion = false,
  showCompletionSummary = true,
  totalHabits = 0,
}: HabitsHeaderProps) {
  const { triggerLightImpact, triggerSelection } = useHapticFeedback({});
  const { dismissTooltip, showTooltip } = useTemplateTooltip();
  const { showBadge, dismissBadge } = useTemplateBadge({ totalHabits });

  // Animated values for the main "Add Habit" button
  const addButtonScale = useSharedValue(1);

  // Animated values for icon buttons
  const sortButtonScale = useSharedValue(1);
  const templatesButtonScale = useSharedValue(1);
  const settingsButtonScale = useSharedValue(1);

  const addButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addButtonScale.value }],
  }));

  const sortButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sortButtonScale.value }],
  }));

  const templatesButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: templatesButtonScale.value }],
  }));

  const settingsButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: settingsButtonScale.value }],
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
    openSortSheet();
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

  // Calculate completion percentage for accessibility
  const percentage =
    totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  // Smart Empty State - hide header completely when user has no habits
  // Let HabitsEmptyState component handle the full onboarding experience
  // Exception: forceShow is true during transition from empty state to list
  if (totalHabits === 0 && !forceShow) {
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
              className='h-12 flex-row items-center gap-2 rounded-full px-5'
              colors={['#101828', '#1a2332']}
              end={{ x: 1, y: 1 }}
              start={{ x: 0, y: 0 }}
              style={{
                elevation: 4,
                shadowColor: '#000',
                shadowOffset: { height: 2, width: 0 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
              }}
            >
              <Plus color='#ffffff' size={18} strokeWidth={2.25} />
              <Text className='text-[15px] font-normal leading-[20px] tracking-tight text-white'>
                Add Habit
              </Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>

        {/* Compact icon group in pill container */}
        <View className='flex-row items-center rounded-full border border-stone-200 bg-white/80 p-1'>
          <Animated.View style={templatesButtonAnimatedStyle}>
            <View style={{ position: 'relative' }}>
              <Pressable
                accessibilityHint='Browse habit templates to add'
                accessibilityLabel='Browse habit templates'
                accessibilityRole='button'
                className='h-11 w-11 items-center justify-center rounded-full'
                onPress={handleTemplatesPress}
                onPressIn={handleTemplatesPressIn}
                onPressOut={handleTemplatesPressOut}
              >
                <BookOpen color='#7c3aed' size={18} strokeWidth={2.25} />
              </Pressable>

              {/* Smart notification badge */}
              <NotificationBadge count={1} visible={showBadge} />
            </View>

            {/* First-time user tooltip */}
            <TemplateTooltip visible={showTooltip} onDismiss={dismissTooltip} />
          </Animated.View>

          <View className='mx-0.5 h-4 w-px bg-stone-200' />

          <Animated.View style={sortButtonAnimatedStyle}>
            <Pressable
              accessibilityHint='Change habit sort order'
              accessibilityLabel='Sort habits'
              accessibilityRole='button'
              className='h-11 w-11 items-center justify-center rounded-full'
              onPress={handleSortPress}
              onPressIn={handleSortPressIn}
              onPressOut={handleSortPressOut}
            >
              <ArrowUpDown color='#44403c' size={18} strokeWidth={2.25} />
            </Pressable>
          </Animated.View>

          <View className='mx-0.5 h-4 w-px bg-stone-200' />

          <Animated.View style={settingsButtonAnimatedStyle}>
            <Pressable
              accessibilityLabel='Open settings'
              accessibilityRole='button'
              className='h-11 w-11 items-center justify-center rounded-full'
              onPress={handleSettingsPress}
              onPressIn={handleSettingsPressIn}
              onPressOut={handleSettingsPressOut}
            >
              <Settings color='#44403c' size={18} strokeWidth={2.25} />
            </Pressable>
          </Animated.View>
        </View>
      </View>

      {/* Daily Momentum Meter */}
      {showCompletionSummary && (
        <View
          accessibilityLabel={`Today ${completedToday} of ${totalHabits} complete, ${percentage} percent`}
          accessibilityRole='text'
        >
          <DailyMomentumMeter
            completedToday={completedToday}
            reduceMotion={reduceMotion}
            size='standard'
            totalHabits={totalHabits}
          />
        </View>
      )}
    </View>
  );
}
