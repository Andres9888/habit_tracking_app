/**
 * Hook for managing pack confirmation state and actions.
 * Matches pack habit names to templates, imports sequentially.
 */

import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useState } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { PremiumPack } from '../data/premiumPacks';

type PackTemplate = { _id: Id<'templates'>; name: string };

export interface PackPartialFailure {
  failedCount: number;
  importedCount: number;
  /** Re-attempts only the templates that failed. */
  retry: () => Promise<void>;
}

interface PackConfirmOptions {
  allTemplates: PackTemplate[] | undefined;
  importTemplate: (args: {
    templateId: Id<'templates'>;
  }) => Promise<{ success: boolean }>;
  onComplete: (count: number) => void;
  /**
   * Called when at least one template in the pack could not be imported
   * (for example the habit-creation rate limit ran out mid-pack). Without
   * this the user would see a partial pack with no explanation.
   */
  onPartialFailure?: (info: PackPartialFailure) => void;
  setImportedIds: Dispatch<SetStateAction<Set<string>>>;
}

export function usePackConfirm(o: PackConfirmOptions) {
  const [selectedPack, setSelectedPack] = useState<PremiumPack | null>(null);

  const handlePackPress = useCallback(
    (pack: PremiumPack) => setSelectedPack(pack),
    []
  );

  const handleCancel = useCallback(() => setSelectedPack(null), []);

  const importAll = useCallback(
    async (templates: PackTemplate[]): Promise<void> => {
      let count = 0;
      const failed: PackTemplate[] = [];
      for (const t of templates) {
        try {
          const res = await o.importTemplate({ templateId: t._id });
          if (res.success) {
            o.setImportedIds((prev) => new Set(prev).add(t._id));
            count++;
          } else {
            failed.push(t);
          }
        } catch {
          failed.push(t);
        }
      }
      if (count > 0) o.onComplete(count);
      if (failed.length > 0) {
        o.onPartialFailure?.({
          failedCount: failed.length,
          importedCount: count,
          retry: () => importAll(failed),
        });
      }
    },
    [o.importTemplate, o.onComplete, o.onPartialFailure, o.setImportedIds]
  );

  const handleConfirm = useCallback(async () => {
    if (!selectedPack || !o.allTemplates) return;
    const normalize = (s: string) => s.trim().toLowerCase();
    const names = new Set(selectedPack.habits.map((h) => normalize(h.name)));
    const matches = o.allTemplates.filter((t) => names.has(normalize(t.name)));
    setSelectedPack(null);
    await importAll(matches);
  }, [selectedPack, o.allTemplates, importAll]);

  return { handleCancel, handleConfirm, handlePackPress, selectedPack };
}
