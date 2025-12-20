import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRef } from 'react';
import STRINGS from '../../../constants/strings';
import { Motion } from '../../../constants/motion';
import { X } from 'lucide-react-native';

interface ModalHeaderProps {
  isEditMode: boolean;
  habitName: string;
  onClose: () => void;
  onSave: () => void;
}

export const ModalHeader = ({ isEditMode, habitName, onClose, onSave }: ModalHeaderProps) => {
  const insets = useSafeAreaInsets();
  const canSave = habitName.trim().length > 0;
  const saveScale = useRef(new Animated.Value(1)).current;
  return (
    <View className='flex-row items-center justify-between px-4 pb-4' style={{ paddingTop: Math.max(insets.top + 8, 16) }}>
      <TouchableOpacity
        accessibilityLabel={STRINGS.CREATE_HABIT.close}
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full'
        onPress={onClose}
      >
        <X color='#44403c' size={24} strokeWidth={2} />
      </TouchableOpacity>
      <Text className='text-[22px] font-semibold text-stone-900'>
        {isEditMode ? 'Edit Habit' : STRINGS.CREATE_HABIT.title}
      </Text>
      <Animated.View style={{ transform: [{ scale: saveScale }] }}>
        <TouchableOpacity
          accessibilityRole='button'
          className={`h-9 items-center justify-center rounded-full px-6 ${
            canSave ? 'bg-stone-800' : 'bg-stone-300'
          }`}
          disabled={!canSave}
          onPressIn={() => {
            Animated.timing(saveScale, {
              duration: Motion.duration.fast,
              easing: Motion.easing.inEase,
              toValue: 0.96,
              useNativeDriver: true,
            }).start();
          }}
          onPressOut={() => {
            Animated.timing(saveScale, {
              duration: Motion.duration.base,
              easing: Motion.easing.outEase,
              toValue: 1,
              useNativeDriver: true,
            }).start();
          }}
          onPress={onSave}
        >
          <Text className='text-sm font-semibold text-white'>
            {STRINGS.CREATE_HABIT.save}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};
