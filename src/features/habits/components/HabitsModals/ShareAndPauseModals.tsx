
import { lazy, Suspense } from 'react';

import type { ShareAndPauseModalsProps } from './HabitsModals.types';
import PauseHabitModal from '../../../../components/PauseHabitModal';

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
      {showShareCard && shareCardData && (
        <Suspense fallback={null}>
          <ShareCardGenerator
            data={shareCardData}
            visible={showShareCard}
            onClose={closeShareCard}
          />
        </Suspense>
      )}

      <PauseHabitModal
        habitName={habitToPause?.name ?? ''}
        visible={showPauseModal}
        onCancel={closePauseModal}
        onConfirm={confirmPause}
      />
    </>
  );
}
