/**
 * Thin wrapper around EmojiPickerSheet driven by useEmojiBrowseSheet, so the
 * sheet can live above the picker (CustomizeFields owns it in the grid layout).
 */
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { EmojiPickerSheet } from '../../../EmojiPickerV2';

interface EmojiBrowseSheetProps {
  visible: boolean;
  habitName?: string;
  selectedEmoji: string | null;
  onSelect: (emoji: string | null) => void;
  onClose: () => void;
}

export function EmojiBrowseSheet({
  visible,
  habitName,
  selectedEmoji,
  onSelect,
  onClose,
}: EmojiBrowseSheetProps) {
  const { triggerSelection } = useHapticFeedback();
  if (!visible) return null;
  return (
    <EmojiPickerSheet
      habitName={habitName || ''}
      selectedEmoji={selectedEmoji}
      visible={visible}
      onClose={onClose}
      onSelect={(emoji: string | null) => {
        onSelect(emoji);
        triggerSelection();
      }}
    />
  );
}
