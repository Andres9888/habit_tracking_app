import PauseHabitModal from '../../../../components/PauseHabitModal';
import type { PauseModalProps } from './HabitsModals.types';

/** Pause habit modal section */
export function PauseModal({
  habitToPause,
  showPauseModal,
  closePauseModal,
  confirmPause,
}: PauseModalProps) {
  return (
    <PauseHabitModal
      habitName={habitToPause?.name ?? ''}
      visible={showPauseModal}
      onCancel={closePauseModal}
      onConfirm={confirmPause}
    />
  );
}
