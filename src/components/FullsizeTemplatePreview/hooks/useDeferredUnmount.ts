/**
 * Delays unmount by `duration` ms after `visible` flips to false,
 * giving exit animations time to play before the component disappears.
 */

import { useEffect, useRef, useState } from 'react';

interface UseDeferredUnmountProps {
  visible: boolean;
  duration: number;
  reducedMotion: boolean;
}

export const useDeferredUnmount = ({
  visible,
  duration,
  reducedMotion,
}: UseDeferredUnmountProps): boolean => {
  const [shouldRender, setShouldRender] = useState(visible);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (visible) {
      setShouldRender(true);
      return;
    }

    if (reducedMotion) {
      setShouldRender(false);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setShouldRender(false);
      timeoutRef.current = null;
    }, duration);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [visible, duration, reducedMotion]);

  return shouldRender;
};
