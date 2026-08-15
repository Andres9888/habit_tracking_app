import { lazy, Suspense, useCallback } from 'react';
import { View } from 'react-native';

import type { Id } from '../../../../../convex/_generated/dataModel';
import ErrorBoundary from '../../../../components/ErrorBoundary';
import Modal from '../../../../components/Modal';
import { requestHabitFocus } from '../../hooks/habitFocusStore';
import { useHaptics } from '../../../../utils/haptics/useHaptics';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { TemplatesModalSectionProps } from './HabitsModals.types';

const TemplatesScreen = lazy(
  () => import('../../../../screens/TemplatesScreen')
);

export function useGoToHabitCard(closeTemplatesScreen: () => void) {
  return useCallback(
    (habitId: Id<'habits'>) => {
      requestHabitFocus(habitId);
      closeTemplatesScreen();
    },
    [closeTemplatesScreen]
  );
}

/**
 * Templates modal section - displays templates screen in full-screen modal
 */
export function TemplatesModalSection({
  closeTemplatesScreen,
  showTemplatesScreen,
}: TemplatesModalSectionProps) {
  const { colors } = useThemeColors();
  const { trigger } = useHaptics();
  const handleViewHabit = useGoToHabitCard(closeTemplatesScreen);

  const handleClose = () => {
    trigger('tap');
    closeTemplatesScreen();
  };

  return (
    <Modal
      disableBackdropClose
      disableGestureClose
      backdropOpacity={0}
      variant='fullScreen'
      visible={showTemplatesScreen}
      onClose={handleClose}
      style={{
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
    >
      <View className='flex-1' style={{ backgroundColor: colors.background }}>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <TemplatesScreen
              onCloseLibrary={handleClose}
              onViewHabit={handleViewHabit}
            />
          </Suspense>
        </ErrorBoundary>
      </View>
    </Modal>
  );
}
