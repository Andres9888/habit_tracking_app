/**
 * Hook for managing pack confirmation state and actions.
 * Matches pack habit names to templates, imports sequentially.
 */

import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useState } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { PremiumPack } from '../data/premiumPacks';

interface PackConfirmOptions {
  allTemplates: { _id: Id<'templates'>; name: string }[] | undefined;
  importTemplate: (args: { templateId: Id<'templates'> }) => Promise<{
    habitId?: Id<'habits'>;
    success: boolean;
  }>;
  onImported: (
    templateId: Id<'templates'>,
    habitId: Id<'habits'> | undefined
  ) => void;
  onComplete: (count: number) => void;
  setImportedIds: Dispatch<SetStateAction<Set<string>>>;
}

export function usePackConfirm(o: PackConfirmOptions) {
  const [selectedPack, setSelectedPack] = useState<PremiumPack | null>(null);

  const handlePackPress = useCallback(
    (pack: PremiumPack) => setSelectedPack(pack),
    []
  );

  const handleCancel = useCallback(() => setSelectedPack(null), []);

  const handleConfirm = useCallback(async () => {
    if (!selectedPack || !o.allTemplates) return;
    const normalize = (s: string) => s.trim().toLowerCase();
    const names = new Set(selectedPack.habits.map((h) => normalize(h.name)));
    const matches = o.allTemplates.filter((t) => names.has(normalize(t.name)));
    let count = 0;
    for (const t of matches) {
      try {
        const res = await o.importTemplate({ templateId: t._id });
        if (res.success) {
          o.onImported(t._id, res.habitId);
          o.setImportedIds((prev) => new Set(prev).add(t._id));
          count++;
        }
      } catch {
        /* skip failed individual imports */
      }
    }
    setSelectedPack(null);
    if (count > 0) o.onComplete(count);
  }, [selectedPack, o]);

  return { handleCancel, handleConfirm, handlePackPress, selectedPack };
}
