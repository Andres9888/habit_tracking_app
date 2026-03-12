import { lazy, Suspense } from 'react';
import PauseHabitModal from '../../../../components/PauseHabitModal';
import type { ShareAndPauseModalsProps } from './HabitsModals.types';

const ShareCardGenerator = lazy(
  () => import('../../../../components/ShareCardGenerator')
);

/** Share card and pause habit modals section */
export function ShareAndPauseModals({
  showShareCard,
  shareCardData,
  closeShareCard,
  habitToPause,
  showPauseModal,
  closePauseModal,
  confirmPause,
}: ShareAndPauseModalsProps) {
  return (
    <>
      {showShareCard && shareCardData ? <Suspense fallback={null}>
          <ShareCardGenerator
            data={shareCardData}
            visible={showShareCard}
            onClose={closeShareCard}
          />
        </Suspense> : null}

      <PauseHabitModal
        habitName={habitToPause?.name ?? ''}
        visible={showPauseModal}
        onCancel={closePauseModal}
        onConfirm={confirmPause}
      />
    </>
  );
}
