import { useEffect } from 'react';
import { Keyboard } from 'react-native';
import type { KeyboardEvent } from 'react-native';
import { Easing, type SharedValue, withTiming } from 'react-native-reanimated';
import { computeKeyboardOverlap, computeToastKeyboardClearance } from './toastKeyboardGeometry';

type ReanimatedEasingFn = (t: number) => number;

const KEYBOARD_EASINGS: Record<KeyboardEvent['easing'], ReanimatedEasingFn> = {
  easeIn: Easing.in(Easing.ease),
  easeInEaseOut: Easing.inOut(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  keyboard: Easing.inOut(Easing.ease),
  linear: Easing.linear,
};

interface ToastKeyboardAnimationOptions {
  clearance: SharedValue<number>;
  enabled: boolean;
  initialClearance: number;
  insetBottom: number;
  screenHeight: number;
}

export function useToastKeyboardAnimation({
  clearance,
  enabled,
  initialClearance,
  insetBottom,
  screenHeight,
}: ToastKeyboardAnimationOptions): void {
  useEffect(() => {
    const targetClearance = { current: initialClearance };
    if (!enabled) {
      // Android adjustResize already keeps the toast above the keyboard.
      clearance.value = 0;
      return;
    }
    const clearanceForEvent = (event: KeyboardEvent) =>
      computeToastKeyboardClearance(
        insetBottom,
        computeKeyboardOverlap(screenHeight, event.endCoordinates.screenY),
        true
      );
    const correctToFrame = (event: KeyboardEvent) => {
      targetClearance.current = clearanceForEvent(event);
      clearance.value = targetClearance.current;
    };
    const correctToHidden = () => {
      targetClearance.current = 0;
      clearance.value = 0;
    };
    const animateToFrame = (event: KeyboardEvent) => {
      const nextClearance = clearanceForEvent(event);
      if (nextClearance === targetClearance.current) {
        // iOS emits overlapping will-show/hide and frame-change notifications.
        return;
      }
      targetClearance.current = nextClearance;
      clearance.value = withTiming(nextClearance, {
        duration: event.duration,
        easing: KEYBOARD_EASINGS[event.easing],
      });
    };
    const subscriptions = [
      Keyboard.addListener('keyboardWillShow', animateToFrame),
      Keyboard.addListener('keyboardWillHide', animateToFrame),
      Keyboard.addListener('keyboardWillChangeFrame', animateToFrame),
      Keyboard.addListener('keyboardDidShow', correctToFrame),
      Keyboard.addListener('keyboardDidHide', correctToHidden),
      Keyboard.addListener('keyboardDidChangeFrame', correctToFrame),
    ];
    const metrics = Keyboard.metrics();
    if (Keyboard.isVisible() && metrics) {
      correctToFrame({ duration: 0, easing: 'keyboard', endCoordinates: metrics });
    } else {
      correctToHidden();
    }
    return () => {
      for (const subscription of subscriptions) subscription.remove();
    };
  }, [clearance, enabled, insetBottom, screenHeight]);
}
