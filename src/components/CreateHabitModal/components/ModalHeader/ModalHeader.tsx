/**
 * Modal header with close/save actions
 */

import { View, TouchableOpacity, Keyboard } from 'react-native';
import { useCallback } from 'react';

import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { ModalHeaderProps } from './types';
import STRINGS from '../../../../constants/strings';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { DoneButton } from './DoneButton';
import { SaveButton } from './SaveButton';
import { colors } from '../../../../theme/colors';
import { useShakeAnimation } from './useShakeAnimation';

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
      <TouchableOpacity
        accessibilityLabel={STRINGS.CREATE_HABIT.close}
        accessibilityRole='button'
        className='h-11 w-11 items-center justify-center rounded-full'
        onPress={onClose}
      >
        <X color={colors.gray[500]} size={24} strokeWidth={2} />
      </TouchableOpacity>

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
