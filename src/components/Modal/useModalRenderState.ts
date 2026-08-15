/**
 * Keeps the modal mounted through its exit animation, then unmounts.
 * `onHidden` runs only after that unmount commit — the close-before-open signal.
 */

import { useEffect, useRef, useState } from 'react';
import { EXIT_DURATIONS } from './Modal.constants';
import type { ModalVariant } from './Modal.types';

interface UseModalRenderStateParams {
  onHidden?: () => void;
  reduceMotion: boolean;
  variant: ModalVariant;
  visible: boolean;
}

export function useModalRenderState({
  onHidden,
  reduceMotion,
  variant,
  visible,
}: UseModalRenderStateParams) {
  const [shouldRender, setShouldRender] = useState(visible);
  const wasShownRef = useRef(visible);
  const hiddenNotifiedRef = useRef(false);
  const onHiddenRef = useRef(onHidden);
  onHiddenRef.current = onHidden;

  useEffect(() => {
    if (visible) {
      wasShownRef.current = true;
      hiddenNotifiedRef.current = false;
      setShouldRender(true);
      return;
    }
    if (reduceMotion) {
      setShouldRender(false);
      return;
    }
    const timeout = setTimeout(
      () => setShouldRender(false),
      EXIT_DURATIONS[variant]
    );
    return () => clearTimeout(timeout);
  }, [reduceMotion, variant, visible]);

  useEffect(() => {
    if (
      !hiddenNotifiedRef.current &&
      !shouldRender &&
      !visible &&
      wasShownRef.current
    ) {
      hiddenNotifiedRef.current = true;
      onHiddenRef.current?.();
    }
  }, [shouldRender, visible]);

  return shouldRender;
}
