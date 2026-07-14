import { useEffect } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Modal from '../../../../components/Modal';
import { ModalCloseButton } from '../../../../components/ui/ModalCloseButton';
import { TemplatesLoadingState } from '../../../../screens/TemplatesScreen/components/TemplatesLoadingState';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { captureTemplatesModalFirstVisible } from '../../templatesModalOpenPerformance';

interface TemplatesModalFallbackProps {
  visible: boolean;
  onClose: () => void;
}

export function TemplatesModalFallback({
  visible,
  onClose,
}: TemplatesModalFallbackProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();

  useEffect(() => {
    if (visible) {
      captureTemplatesModalFirstVisible('skeleton');
    }
  }, [visible]);

  return (
    <Modal
      disableBackdropClose
      disableGestureClose
      backdropOpacity={0}
      variant='fullScreen'
      visible={visible}
      onClose={onClose}
      style={{
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
    >
      <View className='flex-1' style={{ backgroundColor: colors.background }}>
        <TemplatesLoadingState />
        <View className='absolute right-4' style={{ top: insets.top + 8 }}>
          <ModalCloseButton
            label='Close templates'
            variant='subtle'
            onClose={onClose}
          />
        </View>
      </View>
    </Modal>
  );
}
