/**
 * Settings-open flag as a tiny external store.
 *
 * It used to be React state inside `useModalVisibilityState`, which lives at
 * the top of the habits screen: every open/close re-rendered the whole Home
 * tree (the full habit list included) before the settings modal even got to
 * render, and the archived-count query keyed off the same flag re-rendered it
 * all again when it landed. Only the settings section subscribes here, so a
 * tap now touches nothing but the modal itself.
 */
import { useSyncExternalStore } from 'react';

let open = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function isSettingsOpen(): boolean {
  return open;
}

export function setSettingsOpen(next: boolean): void {
  if (open === next) return;
  open = next;
  for (const listener of listeners) listener();
}

export function useSettingsOpen(): boolean {
  return useSyncExternalStore(subscribe, isSettingsOpen, () => false);
}

/** Test-only: drop the flag between cases. */
export function resetSettingsOpenForTests(): void {
  open = false;
}
