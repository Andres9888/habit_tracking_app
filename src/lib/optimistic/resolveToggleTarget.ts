import type { Id } from '../../../convex/_generated/dataModel';

export interface ToggleTargetArgs {
  completed?: boolean;
  date: string;
  habitId: Id<'habits'>;
}

/** Prefer an explicit desired state so a stale UI cannot flip the server. */
export function resolveToggleTarget(
  args: ToggleTargetArgs,
  getCurrentStatus: (habitId: Id<'habits'>, date: string) => boolean
): boolean {
  return args.completed ?? !getCurrentStatus(args.habitId, args.date);
}
