import { useCallback, useRef, useState } from 'react';

/**
 * Mount state for the amber forge-flash overlay.
 *
 * The overlay's opacity runs on the native driver, so a dropped native update
 * leaves the cell painted solid amber with no further value change to repaint
 * it — the failure mode behind three earlier "force opacity back to 0" fixes.
 * Pushing the reset through the same native channel that just failed cannot
 * work. Unmounting the view can: a view that does not exist cannot carry a
 * stale native prop.
 */
export function useForgeFlashMount() {
  const [flashActive, setFlashActive] = useState(false);
  // Mirrors state so the setter stays identity-stable and skips no-op renders
  // even when called repeatedly from animation callbacks and safety timers.
  const activeRef = useRef(false);

  const setFlashMounted = useCallback((active: boolean) => {
    if (activeRef.current === active) return;
    activeRef.current = active;
    setFlashActive(active);
  }, []);

  return { flashActive, setFlashMounted };
}
