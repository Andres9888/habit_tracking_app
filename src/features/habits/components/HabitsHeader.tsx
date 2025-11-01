import { Plus, Settings, Microscope } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

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
  return (
    <View className='mt-3 flex-row items-center justify-between'>
      <Pressable
        accessibilityHint='Open create habit modal'
        accessibilityLabel='Add habit'
        accessibilityRole='button'
        className='h-12 flex-row items-center gap-2 rounded-full bg-[#101828] px-5'
        onPress={openCreateHabitScreen}
      >
        <Plus color='#ffffff' size={18} strokeWidth={2.25} />
        <Text className='text-base font-normal tracking-tight text-white'>
          Habits
        </Text>
      </Pressable>
      <View className='flex-row gap-3'>
        <Pressable
          accessibilityLabel='Open habit science'
          accessibilityRole='button'
          className='h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6]'
          onPress={openTemplatesScreen}
        >
          <Microscope color='#101727' size={20} strokeWidth={2.25} />
        </Pressable>
        <Pressable
          accessibilityLabel='Open settings'
          accessibilityRole='button'
          className='h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6]'
          onPress={openSettings}
        >
          <Settings color='#101727' size={20} strokeWidth={2.25} />
        </Pressable>
      </View>
    </View>
  );
}
