/**
 * Pick the quiet check-in caption: minimal completions win over milestone copy.
 */
import type { MilestoneProgress } from '../ThisWeekCard';
import { milestoneCaption } from '../ThisWeekCard';

export function checkInCaption(options: {
  isMinimal: boolean;
  progress: MilestoneProgress | null;
}): string | undefined {
  if (options.isMinimal) return '2-min version';
  return options.progress ? milestoneCaption(options.progress) : undefined;
}
