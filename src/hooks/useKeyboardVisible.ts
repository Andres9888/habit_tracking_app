import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';
import type { KeyboardEvent } from 'react-native';

/**
 * Hook that tracks keyboard visibility and height
 *
 * Works on both iOS and Android:
 * - iOS: Uses keyboardWillShow/Hide for smoother animations
 * - Android: Uses keyboardDidShow/Hide (will* events not supported)
 *
 * @returns Object with isKeyboardVisible boolean and keyboardHeight number
 */
export const useKeyboardVisible = (): {
  isKeyboardVisible: boolean;
  keyboardHeight: number;
} => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const handleShow = (event: KeyboardEvent) => {
      setIsKeyboardVisible(true);
      setKeyboardHeight(event.endCoordinates?.height ?? 0);
    };

    const handleHide = () => {
      setIsKeyboardVisible(false);
      setKeyboardHeight(0);
    };

    // Use 'will' events on iOS for smoother animations, 'did' on Android
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, handleShow);
    const hideSubscription = Keyboard.addListener(hideEvent, handleHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return { isKeyboardVisible, keyboardHeight };
};
