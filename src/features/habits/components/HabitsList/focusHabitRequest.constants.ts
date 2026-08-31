/** Consecutive fallback-free instant scrolls before the row counts as placed. */
export const CONVERGED_CLEAN_POLLS = 2;
/** Re-check cadence while instant jumps or native layouts are converging. */
export const SETTLE_POLL_MS = 100;
/** Longest to wait for scroll probes; native row layout is still mandatory. */
export const MAX_HIDDEN_WAIT_MS = 3500;
/** Give React/native three frames to paint the highlight before revealing it. */
export const HIGHLIGHT_PREPAINT_MS = 50;
/** A native scroll event wakes a stranded VirtualizedList render window. */
export const RENDER_WINDOW_NUDGE_PX = 2;
