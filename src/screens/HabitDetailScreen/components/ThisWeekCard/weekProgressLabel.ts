/**
 * The right-hand label on the week header.
 *
 * "0 days logged" is a grade handed out before the user has had a chance to do
 * anything — the soft-clothes version of the red X the retention research
 * names as the #1 quit trigger. While nothing is logged and the week still has
 * scheduled days in it, the honest framing is forward: how many chances are
 * left. The count comes back the moment it means something.
 */

export interface WeekProgressLabel {
  label: string;
  tone: 'muted' | 'accent';
}

export function weekProgressLabel(
  doneCount: number,
  remainingScheduled: number
): WeekProgressLabel {
  if (doneCount === 0 && remainingScheduled > 0) {
    return {
      label: `${remainingScheduled} ${remainingScheduled === 1 ? 'day' : 'days'} left`,
      tone: 'accent',
    };
  }
  return {
    label: `${doneCount} ${doneCount === 1 ? 'day' : 'days'} logged`,
    tone: 'muted',
  };
}
