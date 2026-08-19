import type { Id } from '../../../../convex/_generated/dataModel';
import { getUserTimezone } from '../../../utils/timezone';

interface PauseMutations {
  habitId: Id<'habits'>;
  pause: (args: {
    habitId: Id<'habits'>;
    timezone?: string;
  }) => Promise<unknown>;
  paused: boolean;
  resume: (args: {
    habitId: Id<'habits'>;
    timezone?: string;
  }) => Promise<unknown>;
}

export async function runPauseToggle({
  habitId,
  pause,
  paused,
  resume,
}: PauseMutations): Promise<void> {
  const timezone = getUserTimezone();
  await (paused ? resume({ habitId, timezone }) : pause({ habitId, timezone }));
}
