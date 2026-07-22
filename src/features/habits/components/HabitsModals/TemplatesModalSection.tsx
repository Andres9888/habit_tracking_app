import { View } from 'react-native';

import ErrorBoundary from '../../../../components/ErrorBoundary';
import Modal from '../../../../components/Modal';
import { useWarmMountWindow } from '../../../../components/Modal/useWarmMountWindow';
import TemplatesScreen from '../../../../screens/TemplatesScreen';
import { useWarmTemplatesCache } from '../../../../screens/TemplatesScreen/useWarmTemplatesCache';
import { useHaptics } from '../../../../utils/haptics/useHaptics';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { TemplatesModalSectionProps } from './HabitsModals.types';

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
  const warmMount = useWarmMountWindow(showTemplatesScreen);
  useWarmTemplatesCache();

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
      warmMount={warmMount}
      onClose={handleClose}
      style={{
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
    >
      <View className='flex-1' style={{ backgroundColor: colors.background }}>
        <ErrorBoundary>
          <TemplatesScreen
            onCloseLibrary={handleClose}
            onViewHabit={handleViewHabit}
          />
        </ErrorBoundary>
      </View>
    </Modal>
  );
}
