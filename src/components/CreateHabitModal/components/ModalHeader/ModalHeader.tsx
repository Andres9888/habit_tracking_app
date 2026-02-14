/**
 * Modal header with close/save actions
 */
import { View, Keyboard } from 'react-native';
import { AnimatedPressable } from '../../../ui/AnimatedPressable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback } from 'react';
import STRINGS from '../../../../constants/strings';
import { X } from 'lucide-react-native';
import { colors } from '../../../../theme/colors';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { useShakeAnimation } from './useShakeAnimation';
import { DoneButton } from './DoneButton';
import { SaveButton } from './SaveButton';
import type { ModalHeaderProps } from './types';

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
  const { triggerSelection, triggerWarning } = useHapticFeedback();
  const { shakeValue, triggerShake } = useShakeAnimation(
    triggerWarning,
    onValidationError
  );

  const handleDismissKeyboard = useCallback(() => {
    triggerSelection();
    if (onDismissKeyboard) {
      onDismissKeyboard();
    } else {
      Keyboard.dismiss();
    }
  }, [triggerSelection, onDismissKeyboard]);

  const headerPadding = isKeyboardVisible
    ? Math.max(insets.top + 2, 10)
    : Math.max(insets.top + 4, 12);

  return (
    <View
      className='flex-row items-center justify-between px-4 pb-2'
      style={{ paddingTop: headerPadding }}
    >
      <AnimatedPressable
        accessibilityLabel={STRINGS.CREATE_HABIT.close}
        accessibilityRole='button'
        className='h-11 w-11 items-center justify-center rounded-full'
        onPress={onClose}
      >
        <X color={colors.gray[500]} size={24} strokeWidth={2} />
      </AnimatedPressable>

      <View className='flex-1' />

      {isKeyboardVisible ? (
        <DoneButton onPress={handleDismissKeyboard} />
      ) : (
        <SaveButton
          canSave={canSave}
          isEditMode={isEditMode}
          shakeValue={shakeValue}
          onInvalidSave={triggerShake}
          onSave={onSave}
        />
      )}
    </View>
  );
};
