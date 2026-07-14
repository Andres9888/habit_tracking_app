import { useEffect, useState } from 'react';

import { EXIT_DURATIONS } from '../../../../components/Modal/Modal.constants';

const RETENTION_MS = Math.max(
  EXIT_DURATIONS.bottomSheet,
  EXIT_DURATIONS.fullScreen
);

export function useRetainedModalMount(active: boolean): boolean {
  const [retained, setRetained] = useState(active);

  useEffect(() => {
    if (active) {
      setRetained(true);
      return;
    }
    if (!retained) return;

    const timeout = setTimeout(() => setRetained(false), RETENTION_MS);
    return () => clearTimeout(timeout);
  }, [active, retained]);

  return active || retained;
}
