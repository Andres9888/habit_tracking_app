import Modal from '../../Modal';
import { ScreenErrorFallback } from '../../ErrorBoundary';
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
