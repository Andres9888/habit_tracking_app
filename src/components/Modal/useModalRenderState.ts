import { useEffect, useState } from 'react';
import { EXIT_DURATIONS } from './Modal.constants';
import type { ModalVariant } from './Modal.types';

export function useModalRenderState(
  visible: boolean,
  reduceMotion: boolean,
  variant: ModalVariant
): boolean {
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
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
  }, [visible, reduceMotion, variant]);

  return shouldRender;
}
