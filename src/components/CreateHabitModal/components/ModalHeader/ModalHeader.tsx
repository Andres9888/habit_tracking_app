/**
 * Modal header with close/save actions
 */
import { useCallback } from 'react';
import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import STRINGS from '../../../../constants/strings';
import { X } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { triggerHaptic } from '../../../../utils/haptics';
import { useShakeAnimation } from './useShakeAnimation';
import { SaveButton } from './SaveButton';
import type { ModalHeaderProps } from './types';

export const ModalHeader = ({
  isEditMode,
  habitName,
  onClose,
  onSave,
  onValidationError,
}: ModalHeaderProps) => {
  const insets = useSafeAreaInsets();
  const { colors: themeColors } = useThemeColors();
  const canSave = habitName.trim().length > 0;
  const { triggerWarning } = useHapticFeedback();
  const { shakeValue, triggerShake } = useShakeAnimation(
    triggerWarning,
    onValidationError
  );

  const handleClose = useCallback(() => {
    triggerHaptic('tap');
    onClose();
  }, [onClose]);

  return (
    <View
      className='flex-row items-center justify-between px-4 pb-2'
      style={{ paddingTop: Math.max(insets.top + 4, 12) }}
    >
      <Pressable
        accessibilityLabel={STRINGS.CREATE_HABIT.close}
        accessibilityRole='button'
        className='h-11 w-11 items-center justify-center rounded-full'
        style={({ pressed }) => ({
          backgroundColor: pressed ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
        })}
        onPress={handleClose}
      >
        <X color={themeColors.text.secondary} size={24} strokeWidth={2} />
      </Pressable>

      <View className='flex-1' />

      <SaveButton
        canSave={canSave}
        isEditMode={isEditMode}
        shakeValue={shakeValue}
        onInvalidSave={triggerShake}
        onSave={onSave}
      />
    </View>
  );
};
