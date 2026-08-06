/** useExportFirst — drives the "Export a copy first" inline status in the delete sheet */
import { useCallback, useState } from 'react';

export type ExportStatus = 'idle' | 'pending' | 'done' | 'error';

export function useExportFirst(
  onExportHabitsData?: () => void | Promise<void>
) {
  const [status, setStatus] = useState<ExportStatus>('idle');

  const runExport = useCallback(() => {
    if (!onExportHabitsData) return;
    setStatus('pending');
    void (async () => {
      try {
        await Promise.resolve(onExportHabitsData());
        setStatus('done');
      } catch {
        setStatus('error');
      }
    })();
  }, [onExportHabitsData]);

  return { status, runExport };
}
