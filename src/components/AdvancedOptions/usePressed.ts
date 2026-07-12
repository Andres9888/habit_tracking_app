/**
 * State-driven pressed flag for Pressables in this section.
 * Function-form `style={({pressed}) => …}` silently drops container styles
 * on NativeWind-wrapped Pressables — always use this + a plain style object.
 */
import { useCallback, useState } from 'react';

export function usePressed() {
  const [pressed, setPressed] = useState(false);
  const onPressIn = useCallback(() => setPressed(true), []);
  const onPressOut = useCallback(() => setPressed(false), []);
  return { pressed, pressProps: { onPressIn, onPressOut } };
}
