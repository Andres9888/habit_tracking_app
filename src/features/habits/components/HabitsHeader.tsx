import { Plus, Settings, Clipboard } from 'lucide-react-native';
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
  openCreateHabitScreen: () => void;
  openSettings: () => void;
  openTemplatesScreen: () => void;
  completedToday?: number;
  totalHabits?: number;
  showCompletionSummary?: boolean;
  reduceMotion?: boolean;
}

export function HabitsHeader({
  openCreateHabitScreen,
  openSettings,
  openTemplatesScreen,
  completedToday = 0,
  totalHabits = 0,
  showCompletionSummary = true,
  reduceMotion = false,
}: HabitsHeaderProps) {
  const { triggerLightImpact, triggerSelection } = useHapticFeedback({});
  const { dismissTooltip, showTooltip } = useTemplateTooltip();
  const { showBadge, dismissBadge } = useTemplateBadge({ totalHabits });

  // Animated values for the main "Add Habit" button
  const addButtonScale = useSharedValue(1);

  // Animated values for icon buttons
  const templatesButtonScale = useSharedValue(1);
  const settingsButtonScale = useSharedValue(1);

  const addButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addButtonScale.value }],
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
  const percentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

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
              accessibilityHint='Browse science-backed habit templates'
              accessibilityLabel='Templates'
              accessibilityRole='button'
              className='h-9 flex-row items-center gap-1.5 rounded-full border border-stone-200 bg-white/60 px-3'
              onPress={handleTemplatesPress}
              onPressIn={handleTemplatesPressIn}
              onPressOut={handleTemplatesPressOut}
            >
              <Clipboard color='#44403c' size={16} strokeWidth={2.25} />
              <Text className='text-[13px] font-medium text-stone-700'>Templates</Text>
            </Pressable>

            {/* Smart notification badge */}
            <NotificationBadge visible={showBadge} count={1} />
          </View>

          {/* First-time user tooltip */}
          <TemplateTooltip visible={showTooltip} onDismiss={dismissTooltip} />
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
      {showCompletionSummary && totalHabits > 0 && (
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
    </View>
  );
}
