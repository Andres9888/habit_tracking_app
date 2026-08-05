import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';
import type { KeyboardEvent } from 'react-native';

/**
 * Hook that tracks keyboard visibility and height for responsive UI adjustments.
 *
 * Automatically listens to platform-appropriate keyboard events:
 * - iOS: Uses keyboardWillShow/Hide for smoother animations
 * - Native Handset: Uses keyboardDidShow/Hide (will* events not supported)
 *
 * @returns Object containing keyboard state
 * @returns returns.isKeyboardVisible - Whether the keyboard is currently visible
 * @returns returns.keyboardHeight - Current keyboard height in pixels (0 when hidden)
 *
 * @example
 * ```tsx
 * const { isKeyboardVisible, keyboardHeight } = useKeyboardVisible();
 *
 * // Adjust view padding when keyboard appears
 * <View style={{ paddingBottom: isKeyboardVisible ? keyboardHeight : 0 }}>
 *   <TextInput accessibilityLabel="Message field" />
 * </View>
 * ```
 */
export const useKeyboardVisible = () => {
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

    const showSubscription = Keyboard.addListener(showEvent, handleShow);
    const hideSubscription = Keyboard.addListener(hideEvent, handleHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return { isKeyboardVisible, keyboardHeight };
};
