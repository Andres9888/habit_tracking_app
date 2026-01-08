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
  /** Called when user taps Save with empty habit name */
  onValidationError?: () => void;
}

export const ModalHeader = ({
  isEditMode,
  habitName,
  onClose,
  onSave,
  isKeyboardVisible = false,
  onDismissKeyboard,
  onValidationError,
}: ModalHeaderProps) => {
  const insets = useSafeAreaInsets();
  const canSave = habitName.trim().length > 0;
  const saveScale = useRef(new Animated.Value(1)).current;
  const saveShake = useRef(new Animated.Value(0)).current;
  const doneScale = useRef(new Animated.Value(1)).current;
  const { triggerSelection, triggerWarning } = useHapticFeedback();

  // Shake animation for validation error
  const triggerShake = useCallback(() => {
    triggerWarning();
    onValidationError?.();
    Animated.sequence([
      Animated.timing(saveShake, {
        duration: 50,
        toValue: 10,
        useNativeDriver: true,
      }),
      Animated.timing(saveShake, {
        duration: 50,
        toValue: -10,
        useNativeDriver: true,
      }),
      Animated.timing(saveShake, {
        duration: 50,
        toValue: 8,
        useNativeDriver: true,
      }),
      Animated.timing(saveShake, {
        duration: 50,
        toValue: -8,
        useNativeDriver: true,
      }),
      Animated.timing(saveShake, {
        duration: 50,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [saveShake, triggerWarning, onValidationError]);

  const handleDismissKeyboard = useCallback(() => {
    triggerSelection();
    if (onDismissKeyboard) {
      onDismissKeyboard();
    } else {
      Keyboard.dismiss();
    }
  }, [triggerSelection, onDismissKeyboard]);

  // Compact padding - reduced for more form space
  const headerPadding = isKeyboardVisible
    ? Math.max(insets.top + 2, 10)
    : Math.max(insets.top + 4, 12);

  return (
    <View
      className='flex-row items-center justify-between px-4 pb-2'
      style={{ paddingTop: headerPadding }}
    >
      {/* Close button - 44px to meet HIG touch target minimum */}
      <TouchableOpacity
        accessibilityLabel={STRINGS.CREATE_HABIT.close}
        accessibilityRole='button'
        className='h-11 w-11 items-center justify-center rounded-full'
        onPress={onClose}
      >
        <X color='#44403c' size={22} strokeWidth={2} />
      </TouchableOpacity>
      {/* Spacer to center-align nothing (keeps buttons at edges) */}
      <View className='flex-1' />

      {/* Show "Done" button when keyboard is visible, otherwise show Save button */}
      {/* Both buttons use 44px height to meet HIG touch target minimum */}
      {isKeyboardVisible ? (
        <Animated.View style={{ transform: [{ scale: doneScale }] }}>
          <TouchableOpacity
            accessibilityLabel='Done editing'
            accessibilityRole='button'
            className='h-11 items-center justify-center rounded-full px-5'
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
        <Animated.View
          style={{
            transform: [{ scale: saveScale }, { translateX: saveShake }],
          }}
        >
          <TouchableOpacity
            accessibilityHint={canSave ? '' : 'Enter a habit name first'}
            accessibilityLabel={
              isEditMode
                ? 'Save habit changes'
                : STRINGS.CREATE_HABIT.createAction
            }
            accessibilityRole='button'
            accessibilityState={{ disabled: !canSave }}
            className={`h-11 items-center justify-center rounded-full px-6 ${
              canSave ? 'bg-stone-800' : 'bg-stone-400'
            }`}
            onPress={canSave ? onSave : triggerShake}
            onPressIn={() => {
              if (canSave) {
                Animated.timing(saveScale, {
                  duration: Motion.duration.fast,
                  easing: Motion.easing.inEase,
                  toValue: 0.96,
                  useNativeDriver: true,
                }).start();
              }
            }}
            onPressOut={() => {
              if (canSave) {
                Animated.timing(saveScale, {
                  duration: Motion.duration.base,
                  easing: Motion.easing.outEase,
                  toValue: 1,
                  useNativeDriver: true,
                }).start();
              }
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
