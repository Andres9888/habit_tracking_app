import { Plus, Settings, Microscope } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useHapticFeedback } from '../../../hooks/useHapticFeedback';

interface HabitsHeaderProps {
  openCreateHabitScreen: () => void;
  openSettings: () => void;
  openTemplatesScreen: () => void;
}

export function HabitsHeader({
  openCreateHabitScreen,
  openSettings,
  openTemplatesScreen,
}: HabitsHeaderProps) {
  const { triggerLightImpact, triggerSelection } = useHapticFeedback({});

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

  return (
    <View className='mt-3 flex-row items-center justify-between'>
      <Animated.View style={addButtonAnimatedStyle}>
        <Pressable
          accessibilityHint='Open create habit modal'
          accessibilityLabel='Add habit'
          accessibilityRole='button'
          className='h-12 flex-row items-center gap-2 rounded-full bg-[#101828] px-5'
          onPress={handleAddHabitPress}
          onPressIn={handleAddHabitPressIn}
          onPressOut={handleAddHabitPressOut}
        >
          <Plus color='#ffffff' size={18} strokeWidth={2.25} />
          <Text className='text-[15px] font-normal leading-[20px] tracking-tight text-white'>
            Habits
          </Text>
        </Pressable>
      </Animated.View>

      <View className='flex-row gap-3'>
        <Animated.View style={templatesButtonAnimatedStyle}>
          <Pressable
            accessibilityLabel='Open habit science'
            accessibilityRole='button'
            className='h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6]'
            onPress={handleTemplatesPress}
            onPressIn={handleTemplatesPressIn}
            onPressOut={handleTemplatesPressOut}
          >
            <Microscope color='#101727' size={20} strokeWidth={2.25} />
          </Pressable>
        </Animated.View>

        <Animated.View style={settingsButtonAnimatedStyle}>
          <Pressable
            accessibilityLabel='Open settings'
            accessibilityRole='button'
            className='h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6]'
            onPress={handleSettingsPress}
            onPressIn={handleSettingsPressIn}
            onPressOut={handleSettingsPressOut}
          >
            <Settings color='#101727' size={20} strokeWidth={2.25} />
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}
