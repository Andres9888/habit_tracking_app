/**
 * Modal header with close/save actions
 */
import { View, Pressable, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback } from 'react';
import { X } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
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
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { colors: themeColors } = useThemeColors();
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
      <Pressable
        accessibilityLabel={t('common.close')}
        accessibilityRole='button'
        className='h-11 w-11 items-center justify-center rounded-full'
        style={({ pressed }) => ({
          backgroundColor: pressed ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
        })}
        onPress={onClose}
      >
        <X color={themeColors.text.secondary} size={24} strokeWidth={2} />
      </Pressable>

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
