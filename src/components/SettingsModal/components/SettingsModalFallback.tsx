import { View } from 'react-native';
import Modal from '../../Modal';
import { ScreenErrorFallback } from '../../ErrorBoundary';
import { SettingsModalSkeleton } from '../../SkeletonLoader';
import { fullScreenModalStyle } from '../SettingsContent.constants';

interface SettingsModalFallbackProps {
  visible: boolean;
  onClose: () => void;
}

export function SettingsModalFallback({
  visible,
  onClose,
}: SettingsModalFallbackProps) {
  return (
    <Modal
      disableBackdropClose
      disableGestureClose
      backdropOpacity={0}
      variant='fullScreen'
      visible={visible}
      onClose={onClose}
      style={fullScreenModalStyle}
    >
      <ScreenErrorFallback
        error={null}
        screenName='Settings'
        onGoBack={onClose}
        onRetry={() => {}}
      />
    </Modal>
  );
}

export function SettingsModalLoadingFallback({
  visible,
  onClose,
}: SettingsModalFallbackProps) {
  return (
    <Modal
      disableBackdropClose
      disableGestureClose
      backdropOpacity={0}
      variant='fullScreen'
      visible={visible}
      onClose={onClose}
      style={fullScreenModalStyle}
    >
      <View className='flex-1' testID='settings-modal-loading-fallback'>
        <SettingsModalSkeleton reduceMotion />
      </View>
    </Modal>
  );
}
