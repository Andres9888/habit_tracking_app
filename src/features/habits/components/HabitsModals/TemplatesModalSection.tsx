import { Modal, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ErrorBoundary from '../../../../components/ErrorBoundary';
import { ModalCloseButton } from '../../../../components/ui/ModalCloseButton';
import { useHaptics } from '../../../../utils/haptics/useHaptics';
import { useThemeColors } from '../../../../theme/ThemeContext';
import TemplatesScreen from '../../../../screens/TemplatesScreen';
import type { TemplatesModalSectionProps } from './HabitsModals.types';

/**
 * Templates modal section - displays templates screen in full-screen modal
 * Uses native Modal animationType='slide' to match Settings panel
 */
export function TemplatesModalSection({
  showTemplatesScreen,
  closeTemplatesScreen,
}: TemplatesModalSectionProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();
  const { trigger } = useHaptics();

  const handleClose = () => {
    trigger('tap');
    closeTemplatesScreen();
  };

  return (
    <Modal
      accessibilityViewIsModal
      animationType='slide'
      presentationStyle='overFullScreen'
      statusBarTranslucent
      transparent
      visible={showTemplatesScreen}
      onRequestClose={handleClose}
    >
      <View className='flex-1' style={{ backgroundColor: colors.background }}>
        <ErrorBoundary>
          <TemplatesScreen />
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
