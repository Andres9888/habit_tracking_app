import React from 'react';
import { AnimatedContent } from '../components/animations/AnimatedContent';
import { CelebrationHeader } from '../components/CelebrationHeader';

type HeaderSectionProps = {
  habitName: string;
  isStreakMilestone?: boolean;
  milestoneNumber?: number;
  reduceMotion: boolean;
  visible: boolean;
  index: number;
};

export function HeaderSection({
  habitName,
  isStreakMilestone,
  milestoneNumber,
  reduceMotion,
  visible,
  index,
}: HeaderSectionProps) {
  return (
    <AnimatedContent
      index={index}
      reduceMotion={reduceMotion}
      visible={visible}
    >
      <CelebrationHeader
        habitName={habitName}
        isStreakMilestone={isStreakMilestone}
        milestoneNumber={milestoneNumber}
        reduceMotion={reduceMotion}
      />
    </AnimatedContent>
  );
}
