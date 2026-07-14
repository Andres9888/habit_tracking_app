import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ErrorBoundary from '../../../../components/ErrorBoundary';
import Modal from '../../../../components/Modal';
import { ModalCloseButton } from '../../../../components/ui/ModalCloseButton';
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
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();
  const { trigger } = useHaptics();
  useWarmTemplatesCache(showTemplatesScreen);

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
          <TemplatesScreen
            onCloseLibrary={handleClose}
            onViewHabit={handleViewHabit}
          />
        </ErrorBoundary>
        <View className='absolute right-4' style={{ top: insets.top + 8 }}>
          <ModalCloseButton
            label='Close templates'
            variant='subtle'
            onClose={handleClose}
          />
        </View>
      </View>
    </Modal>
  );
}
