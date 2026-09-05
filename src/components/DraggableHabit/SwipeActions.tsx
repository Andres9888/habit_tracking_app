import React from 'react';
import Animated, { type SharedValue } from 'react-native-reanimated';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { DeleteAction } from './DeleteAction';
import { ArchiveAction } from './ArchiveAction';
import { useSwipeActionsAnimation } from './useSwipeActionsAnimation';

interface SwipeActionsProps {
  dragX: SharedValue<number>;
  onArchive: () => void;
  onDelete: () => void;
}

export function SwipeActions({ dragX, onArchive, onDelete }: SwipeActionsProps) {
  const { triggerWarning } = useHapticFeedback();
  const { archiveIconStyle, containerStyle } = useSwipeActionsAnimation(dragX);

  const handleArchive = () => {
    triggerWarning();
    onArchive();
  };
  const handleDelete = () => {
    triggerWarning();
    onDelete();
  };

  return (
    <Animated.View
      className="flex-row items-center justify-end"
      style={containerStyle}
    >
      <DeleteAction dragX={dragX} onPress={handleDelete} />
      <ArchiveAction archiveIconStyle={archiveIconStyle} onPress={handleArchive} />
    </Animated.View>
  );
}
