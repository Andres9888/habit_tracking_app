/** DetailHeroSection - Hero card above the sticky tabs. The complete action is no
 *  longer bundled here; it lives in the pinned StickyCompleteBar so it never scrolls away. */
import type { Habit } from '../../../features/habits/types';
import { DetailHero } from './DetailHero';

interface DetailHeroSectionProps {
  daysTracking?: number;
  habit: Habit;
  isCompletedToday: boolean;
  totalCompletions: number;
}

export function DetailHeroSection({
  daysTracking,
  habit,
  isCompletedToday,
  totalCompletions,
}: DetailHeroSectionProps) {
  return (
    <DetailHero
      daysTracking={daysTracking}
      habit={habit}
      isCompletedToday={isCompletedToday}
      totalCompletions={totalCompletions}
    />
  );
}
