/**
 * Modal header with close/save actions
 */
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import STRINGS from '../../../../constants/strings';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { ModalCloseButton } from '../../../ui/ModalCloseButton';
import { useShakeAnimation } from './useShakeAnimation';
import { SaveButton } from './SaveButton';
import type { ModalHeaderProps } from './types';

export const ModalHeader = ({
  isEditMode,
  habitName,
  isSaving = false,
  onClose,
  onSave,
  onValidationError,
}: ModalHeaderProps) => {
  const insets = useSafeAreaInsets();
  const canSave = habitName.trim().length > 0;
  const { triggerWarning } = useHapticFeedback();
  const { shakeValue, triggerShake } = useShakeAnimation(
    triggerWarning,
    onValidationError
  );

  return (
    <View
      className='flex-row items-center justify-between px-4 pb-2'
      style={{ paddingTop: Math.max(insets.top + 4, 12) }}
    >
      <ModalCloseButton label={STRINGS.CREATE_HABIT.close} onClose={onClose} />

      <View className='flex-1' />

      <SaveButton
        canSave={canSave}
        isEditMode={isEditMode}
        isSaving={isSaving}
        shakeValue={shakeValue}
        onInvalidSave={triggerShake}
        onSave={onSave}
      />
    </View>
  );
};
