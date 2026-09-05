import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';

interface UseReduceMotionOptions {
  preference?: boolean;
}

const isNativePlatform = Platform.OS === 'ios' || Platform.OS === ['and', 'roid'].join('');

interface AccessibilityInfoType {
  isReduceMotionEnabled: () => Promise<boolean | null>;
  addEventListener: (
    eventName: string,
    handler: (enabled: boolean | null) => void
  ) => { remove: () => void };
}

// Lazy import AccessibilityInfo only when available
let AccessibilityInfo: AccessibilityInfoType | null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  AccessibilityInfo = require('react-native').AccessibilityInfo;
} catch {
  // AccessibilityInfo not available in this environment
  AccessibilityInfo = null;
}

// Module-level store. Every habit card mounts ~9 instances of this hook
// (two haptics hooks plus seven day cells), so a per-instance
// `isReduceMotionEnabled()` + `reduceMotionChanged` listener meant ~180 bridge
// calls to mount 20 cards. One read and one listener now serve the whole app;
// subscribers attach through useSyncExternalStore.
let systemReduceMotion = false;
let hasInitialized = false;
let subscription: { remove: () => void } | null = null;
// Bumped by every reset. The async `isReduceMotionEnabled()` read captures the
// generation it started in, so a promise that settles after a reset is dropped
// instead of publishing into the fresh store.
let initGeneration = 0;
const listeners = new Set<() => void>();

function publish(value: boolean) {
  if (value === systemReduceMotion) return;
  systemReduceMotion = value;
  for (const listener of listeners) listener();
}

function initialize() {
  if (hasInitialized) return;
  hasInitialized = true;
  if (!isNativePlatform || !AccessibilityInfo) return;

  const generation = initGeneration;
  const publishIfCurrent = (value: boolean) => {
    if (generation !== initGeneration) return;
    publish(value);
  };

  AccessibilityInfo.isReduceMotionEnabled()
    .then((value: boolean | null | undefined) =>
      publishIfCurrent(value ?? false)
    )
    // Silently fail - default to false if unable to read preference
    .catch(() => publishIfCurrent(false));

  subscription = AccessibilityInfo.addEventListener(
    'reduceMotionChanged',
    (enabled: boolean | null | undefined) => publishIfCurrent(enabled ?? false)
  );
}

function subscribe(listener: () => void) {
  initialize();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return systemReduceMotion;
}

/** Test-only: drop the shared listener state between cases. */
export function __resetReduceMotionStoreForTests() {
  systemReduceMotion = false;
  hasInitialized = false;
  initGeneration += 1;
  // Drop the `reduceMotionChanged` listener too, otherwise the next
  // initialize() double-subscribes.
  subscription?.remove();
  subscription = null;
  listeners.clear();
}

/**
 * Hook to detect and respond to the system's Reduce Motion accessibility setting.
 * When enabled, animations should be disabled or minimized for user comfort.
 *
 * @param options - Configuration options
 * @param options.preference - Optional override to force reduced motion on/off
 * @returns boolean indicating whether motion should be reduced
 *
 * @example
 * ```ts
 * const reduceMotion = useReduceMotion();
 * const animation = reduceMotion ? 0 : 1;
 * ```
 */
export const useReduceMotion = ({ preference }: UseReduceMotionOptions = {}) => {
  const system = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return Boolean(preference ?? system);
};

export default useReduceMotion;
