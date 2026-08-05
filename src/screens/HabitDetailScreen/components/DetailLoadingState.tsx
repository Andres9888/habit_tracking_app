/** Loading state shown when HabitDetailScreen modal is visible but habit data hasn't loaded yet */
import { HabitDetailSkeleton } from '../../../components/SkeletonLoader';

export function DetailLoadingState() {
  return <HabitDetailSkeleton />;
}
