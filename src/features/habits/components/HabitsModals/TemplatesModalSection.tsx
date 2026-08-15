import { lazy, Suspense } from 'react';
import { View } from 'react-native';

import ErrorBoundary from '../../../../components/ErrorBoundary';
import Modal from '../../../../components/Modal';
import { useHaptics } from '../../../../utils/haptics/useHaptics';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { TemplatesModalSectionProps } from './HabitsModals.types';
import { useLibraryDetailHandoff } from './useLibraryDetailHandoff';

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
  const { handleClose, handleLibraryHidden, handleViewHabit } =
    useLibraryDetailHandoff({
      closeTemplatesScreen,
      habits,
      openHabitDetail,
    });

  return (
    <Modal
      disableBackdropClose
      disableGestureClose
      backdropOpacity={0}
      variant='fullScreen'
      visible={showTemplatesScreen}
      onClose={() => {
        trigger('tap');
        handleClose();
      }}
      onHidden={handleLibraryHidden}
      style={{
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
    >
      <View className='flex-1' style={{ backgroundColor: colors.background }}>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <TemplatesScreen
              onCloseLibrary={() => {
                trigger('tap');
                handleClose();
              }}
              onViewHabit={handleViewHabit}
            />
          </Suspense>
        </ErrorBoundary>
      </View>
    </Modal>
  );
}
