import { Animated, Text, TouchableOpacity, View, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRef, useCallback } from 'react';
import STRINGS from '../../../constants/strings';
import { Motion } from '../../../constants/motion';
import { X } from 'lucide-react-native';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

interface ModalHeaderProps {
  isEditMode: boolean;
  habitName: string;
  onClose: () => void;
  onSave: () => void;
  isKeyboardVisible?: boolean;
  onDismissKeyboard?: () => void;
}

export const ModalHeader = ({
  isEditMode,
  habitName,
  onClose,
  onSave,
  isKeyboardVisible = false,
  onDismissKeyboard,
}: ModalHeaderProps) => {
  const insets = useSafeAreaInsets();
  const canSave = habitName.trim().length > 0;
  const saveScale = useRef(new Animated.Value(1)).current;
  const doneScale = useRef(new Animated.Value(1)).current;
  const { triggerSelection } = useHapticFeedback();

  const handleDismissKeyboard = useCallback(() => {
    triggerSelection();
    if (onDismissKeyboard) {
      onDismissKeyboard();
    } else {
      Keyboard.dismiss();
    }
  }, [triggerSelection, onDismissKeyboard]);

  // Compact padding when keyboard is visible
  const headerPadding = isKeyboardVisible
    ? Math.max(insets.top + 4, 12)
    : Math.max(insets.top + 8, 16);

  return (
    <View
      className='flex-row items-center justify-between px-4 pb-3'
      style={{ paddingTop: headerPadding }}
    >
      <TouchableOpacity
        accessibilityLabel={STRINGS.CREATE_HABIT.close}
        accessibilityRole='button'
        className='h-10 w-10 items-center justify-center rounded-full'
        onPress={onClose}
      >
        <X color='#44403c' size={24} strokeWidth={2} />
      </TouchableOpacity>
      <Text className='text-[24px] font-bold text-stone-900'>
        {isEditMode ? 'Edit Habit' : STRINGS.CREATE_HABIT.title}
      </Text>

      {/* Show "Done" button when keyboard is visible, otherwise show Save button */}
      {isKeyboardVisible ? (
        <Animated.View style={{ transform: [{ scale: doneScale }] }}>
          <TouchableOpacity
            accessibilityLabel='Done editing'
            accessibilityRole='button'
            className='h-9 items-center justify-center rounded-full px-4'
            onPress={handleDismissKeyboard}
            onPressIn={() => {
              Animated.timing(doneScale, {
                duration: Motion.duration.fast,
                easing: Motion.easing.inEase,
                toValue: 0.96,
                useNativeDriver: true,
              }).start();
            }}
            onPressOut={() => {
              Animated.timing(doneScale, {
                duration: Motion.duration.base,
                easing: Motion.easing.outEase,
                toValue: 1,
                useNativeDriver: true,
              }).start();
            }}
          >
            <Text className='text-base font-semibold text-blue-600'>Done</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Animated.View style={{ transform: [{ scale: saveScale }] }}>
          <TouchableOpacity
            accessibilityHint={canSave ? '' : 'Enter a habit name first'}
            accessibilityLabel={
              isEditMode
                ? 'Save habit changes'
                : STRINGS.CREATE_HABIT.createAction
            }
            accessibilityRole='button'
            accessibilityState={{ disabled: !canSave }}
            className={`h-9 items-center justify-center rounded-full px-6 ${
              canSave ? 'bg-stone-800' : 'bg-stone-400'
            }`}
            disabled={!canSave}
            onPress={onSave}
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
          >
            <Text className='text-sm font-semibold text-white'>
              {STRINGS.CREATE_HABIT.save}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};
