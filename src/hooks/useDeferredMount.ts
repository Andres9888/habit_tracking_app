import { useEffect, useState } from 'react';
import { InteractionManager } from 'react-native';

/**
 * Defers heavy content mount until after the current interactions settle.
 *
 * Returns `ready`, which starts `false` and latches `true` once
 * InteractionManager reports interactions are done AND one animation frame
 * has painted afterwards. The rAF chaser guarantees the cheap skeleton commit
 * paints a frame before the heavy content commit — the Reanimated open
 * animation runs on the UI thread and is not tracked by InteractionManager,
 * so we lean on InteractionManager for JS-side work and rAF for the paint gap.
 *
 * `ready` never resets. Because the modal unmounts its children after the exit
 * animation, this hook re-runs on every open and never flashes a skeleton on
 * close. Preferred over `scheduleWhenIdle`, which degrades to a fixed
 * `setTimeout` on Hermes (no `requestIdleCallback`) and is decoupled from the
 * animation.
 */
export function useDeferredMount(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let raf = 0;
    const interaction = InteractionManager.runAfterInteractions(() => {
      raf = requestAnimationFrame(() => setReady(true));
    });

    return () => {
      interaction.cancel();
      if (raf) {
        cancelAnimationFrame(raf);
      }
    };
  }, []);

  return ready;
}
