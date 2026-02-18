import { useEffect } from 'react';
import { Keyboard, Platform } from 'react-native';
import type { KeyboardEvent } from 'react-native';

export type KeyboardEventHandler = (event: KeyboardEvent) => void;

/**
 * Hook for handling keyboard events with proper cleanup
 * All listeners are properly removed on unmount to prevent memory leaks
 *
 * @param options - Configuration options
 * @param options.onShow - Callback when keyboard shows
 * @param options.onHide - Callback when keyboard hides
 * @param options.enabled - Whether the listener is enabled
 *
 * @example
 * ```tsx
 * useKeyboardEvents({
 *   onShow: () => console.log('Keyboard shown'),
 *   onHide: () => console.log('Keyboard hidden'),
 * });
 * ```
 */
export function useKeyboardEvents({
  onShow,
  onHide,
  enabled = true,
}: {
  onShow?: KeyboardEventHandler;
  onHide?: KeyboardEventHandler;
  enabled?: boolean;
} = {}) {
  useEffect(() => {
    if (!enabled) return;

    const subscriptions: Array<{ remove: () => void }> = [];

    if (onShow) {
      const showEvent =
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
      subscriptions.push(Keyboard.addListener(showEvent, onShow));
    }

    if (onHide) {
      const hideEvent =
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
      subscriptions.push(Keyboard.addListener(hideEvent, onHide));
    }

    return () => {
      for (const sub of subscriptions) sub.remove();
    };
  }, [enabled, onShow, onHide]);
}
