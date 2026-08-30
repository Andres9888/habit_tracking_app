import { useEffect, useRef } from 'react';
import { Animated, Easing, Keyboard } from 'react-native';
import type { EasingFunction, KeyboardEvent } from 'react-native';
import { computeKeyboardOverlap, computeToastKeyboardClearance } from './toastKeyboardGeometry';

const KEYBOARD_EASINGS: Record<KeyboardEvent['easing'], EasingFunction> = {
  easeIn: Easing.in(Easing.ease),
  easeInEaseOut: Easing.inOut(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  keyboard: Easing.inOut(Easing.ease),
  linear: Easing.linear,
};

interface ToastKeyboardAnimationOptions {
  clearance: Animated.Value;
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
  const keyboardAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const targetClearance = useRef(initialClearance);

  useEffect(() => {
    const stopKeyboardAnimation = () => {
      keyboardAnimation.current?.stop();
      keyboardAnimation.current = null;
    };
    if (!enabled) {
      // Android adjustResize already keeps the toast above the keyboard.
      clearance.setValue(0);
      return () => clearance.stopAnimation();
    }
    const clearanceForEvent = (event: KeyboardEvent) =>
      computeToastKeyboardClearance(
        insetBottom,
        computeKeyboardOverlap(screenHeight, event.endCoordinates.screenY),
        true
      );
    const correctToFrame = (event: KeyboardEvent) => {
      stopKeyboardAnimation();
      targetClearance.current = clearanceForEvent(event);
      clearance.setValue(targetClearance.current);
    };
    const correctToHidden = () => {
      stopKeyboardAnimation();
      targetClearance.current = 0;
      clearance.setValue(0);
    };
    const animateToFrame = (event: KeyboardEvent) => {
      const nextClearance = clearanceForEvent(event);
      if (nextClearance === targetClearance.current) {
        // iOS emits overlapping will-show/hide and frame-change notifications.
        return;
      }
      stopKeyboardAnimation();
      targetClearance.current = nextClearance;
      keyboardAnimation.current = Animated.timing(clearance, {
        duration: event.duration,
        easing: KEYBOARD_EASINGS[event.easing],
        toValue: nextClearance,
        useNativeDriver: true,
      });
      keyboardAnimation.current.start();
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
      stopKeyboardAnimation();
      clearance.stopAnimation();
    };
  }, [clearance, enabled, insetBottom, screenHeight]);
}
