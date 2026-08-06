/** DeleteAccountSheet — bottom sheet: consequences, export-first, ack-gated delete */
import { useEffect } from 'react';
import { Text } from 'react-native';
import { triggerHaptic } from '@/utils/haptics';
import { useAccessibilityFocus } from '@/hooks/useAccessibilityFocus';
import { Modal } from '../Modal';
import { typography, fontWeights } from '../../theme/typography';
import { useThemeColors } from '../../theme/ThemeContext';
import { ConsequenceList } from './components/ConsequenceList';
import { ExportStatus } from './components/ExportStatus';
import { DeleteSheetActions } from './components/DeleteSheetActions';
import { useExportFirst } from './useExportFirst';
import { DELETE_ACCOUNT_SUBTITLE } from './constants';
import type { DeleteAccountSheetProps } from './types';

export function DeleteAccountSheet({
  visible,
  isDeleting,
  acknowledged,
  onToggleAcknowledged,
  onConfirm,
  onCancel,
  onExportHabitsData,
}: DeleteAccountSheetProps) {
  const { colors: themeColors } = useThemeColors();
  const { status, runExport } = useExportFirst(onExportHabitsData);
  const { ref: titleRef, focus: focusTitle } = useAccessibilityFocus();

  const handleConfirm = () => {
    void triggerHaptic('heavy');
    onConfirm();
  };

  useEffect(() => {
    if (visible) focusTitle();
  }, [visible, focusTitle]);

  return (
    <Modal
      accessibilityViewIsModal
      disableBackdropClose={isDeleting}
      disableGestureClose={isDeleting}
      variant='bottomSheet'
      visible={visible}
      onClose={onCancel}
    >
      <Text
        ref={titleRef}
        accessible
        className='mb-1.5 text-center'
        style={{
          ...typography.heading2,
          fontWeight: fontWeights.bold,
          color: themeColors.text.primary,
        }}
      >
        Delete account?
      </Text>
      <Text
        className='mb-4 text-center'
        style={{ ...typography.bodySmall, color: themeColors.text.secondary }}
      >
        {DELETE_ACCOUNT_SUBTITLE}
      </Text>

      <ConsequenceList />
      <ExportStatus status={status} onRetry={runExport} />
      <DeleteSheetActions
        acknowledged={acknowledged}
        canExport={!!onExportHabitsData}
        isDeleting={isDeleting}
        onCancel={onCancel}
        onConfirm={handleConfirm}
        onExportFirst={runExport}
        onToggleAcknowledged={onToggleAcknowledged}
      />
    </Modal>
  );
}

export default DeleteAccountSheet;
