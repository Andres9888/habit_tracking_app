import { useEffect, useState } from 'react';
import type { KeyboardEvent } from 'react-native';
import { Keyboard, Platform } from 'react-native';

export const useKeyboardState = () => {
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

    // Use 'will' events on iOS for smoother animations, 'did' on Native Handset
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, handleShow);
    const hideSub = Keyboard.addListener(hideEvent, handleHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return { isKeyboardVisible, keyboardHeight };
};
