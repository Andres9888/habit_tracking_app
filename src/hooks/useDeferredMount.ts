import { useEffect, useState } from 'react';
import { InteractionManager } from 'react-native';

/** Keys whose deferral has already been paid once this app session. */
const latchedKeys = new Set<string>();

export interface UseDeferredMountOptions {
  /**
   * Opt into a process-lifetime latch. The first mount under a given key defers
   * as usual; every later mount under that same key returns `true` on the very
   * first render, so a remounting surface (a modal that unmounts its children
   * on close) does not replay its skeleton on every open.
   */
  latchKey?: string;
}

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
 * Within a mount, `ready` never resets, so nothing flashes a skeleton on close.
 * Across mounts it does reset unless `latchKey` is supplied — the first open
 * pays the deferral so the enter animation stays smooth on a cold tree, and
 * subsequent opens render content immediately because that tree is already
 * warm. Preferred over `scheduleWhenIdle`, which degrades to a fixed
 * `setTimeout` on Hermes (no `requestIdleCallback`) and is decoupled from the
 * animation.
 */
export function useDeferredMount(
  options: UseDeferredMountOptions = {}
): boolean {
  const { latchKey } = options;
  const [ready, setReady] = useState(
    () => latchKey !== undefined && latchedKeys.has(latchKey)
  );

  useEffect(() => {
    if (latchKey !== undefined && latchedKeys.has(latchKey)) return;

    let raf = 0;
    const interaction = InteractionManager.runAfterInteractions(() => {
      raf = requestAnimationFrame(() => {
        if (latchKey !== undefined) latchedKeys.add(latchKey);
        setReady(true);
      });
    });

    return () => {
      interaction.cancel();
      if (raf) {
        cancelAnimationFrame(raf);
      }
    };
  }, [latchKey]);

  return ready;
}

/** Test-only: drops every latch so cases start from a cold tree. */
export function resetDeferredMountLatches(): void {
  latchedKeys.clear();
}
