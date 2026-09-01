import { Check } from 'lucide-react-native';

import { ActionToast } from '../../../components/ArchiveUndoToast';
import { useInsightPalette } from '../insightPalette';

interface CompletionUndoToastProps {
  streak: number;
  visible: boolean;
  onDismiss: () => void;
  onUndo: () => void;
}

export function CompletionUndoToast({
  streak,
  visible,
  onDismiss,
  onUndo,
}: CompletionUndoToastProps) {
  const palette = useInsightPalette();
  const message = `Logged — ${streak}-day streak.`;

  return (
    <ActionToast
      accessibilityLabel={`${message} Undo available.`}
      actionLabel='Undo'
      actionTextColor={palette.ctaGreen}
      duration={4000}
      icon={<Check color={palette.ctaGreen} size={18} strokeWidth={3} />}
      message={message}
      progressColor={palette.ctaGreen}
      tintColor={palette.greenTint}
      visible={visible}
      onAction={onUndo}
      onDismiss={onDismiss}
    />
  );
}
