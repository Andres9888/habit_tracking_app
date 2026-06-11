/**
 * Modal header with close/save actions
 */
import { ScreenHeader } from '../../../ScreenHeader';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
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
  const canSave = habitName.trim().length > 0;
  const { triggerWarning } = useHapticFeedback();
  const { shakeValue, triggerShake } = useShakeAnimation(
    triggerWarning,
    onValidationError
  );

  return (
    <ScreenHeader
      leftAction='close'
      rightAction={
        <SaveButton
          canSave={canSave}
          isEditMode={isEditMode}
          isSaving={isSaving}
          shakeValue={shakeValue}
          onInvalidSave={triggerShake}
          onSave={onSave}
        />
      }
      onBack={onClose}
    />
  );
};
