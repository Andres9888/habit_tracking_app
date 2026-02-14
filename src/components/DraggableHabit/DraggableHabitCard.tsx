import React from 'react';
import { Swipeable } from 'react-native-gesture-handler';
import { ArchiveAction } from './ArchiveAction';
import { HabitCardInner } from './HabitCardInner';
import type { DraggableHabitCardProps } from './DraggableHabitCard.types';

export type { DraggableHabitCardProps } from './DraggableHabitCard.types';

export function DraggableHabitCard(props: DraggableHabitCardProps) {
  const habitCard = <HabitCardInner {...props} />;

  if (!props.onArchive) return habitCard;

  return (
    <Swipeable
      friction={2}
      overshootRight={false}
      renderRightActions={(_, dragX) => <ArchiveAction dragX={dragX} />}
      rightThreshold={40}
      onSwipeableOpen={props.handleSwipeableOpen}
    >
      {habitCard}
    </Swipeable>
  );
}
