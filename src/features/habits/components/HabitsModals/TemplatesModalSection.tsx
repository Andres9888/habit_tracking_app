import { lazy, Suspense } from 'react';
import { View } from 'react-native';

import ErrorBoundary from '../../../../components/ErrorBoundary';
import Modal from '../../../../components/Modal';
import { useHaptics } from '../../../../utils/haptics/useHaptics';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { TemplatesModalSectionProps } from './HabitsModals.types';

const TemplatesScreen = lazy(
  () => import('../../../../screens/TemplatesScreen')
);

/**
 * Templates modal section - displays templates screen in full-screen modal
 */
export function TemplatesModalSection({
  closeTemplatesScreen,
  habits,
  openHabitDetail,
  showTemplatesScreen,
}: TemplatesModalSectionProps) {
  const { colors } = useThemeColors();
  const { trigger } = useHaptics();

  const handleClose = () => {
    trigger('tap');
    closeTemplatesScreen();
  };

  const handleViewHabit = (habitId: string) => {
    const habit = habits.find((item) => item._id === habitId);
    if (!habit) return;
    closeTemplatesScreen();
    openHabitDetail(habit);
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
