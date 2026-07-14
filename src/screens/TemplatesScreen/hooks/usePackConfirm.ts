/**
 * Hook for managing pack confirmation state and actions.
 * Matches pack habit names to templates, imports sequentially.
 */

import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useState } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { PremiumPack } from '../data/premiumPacks';
import type { TemplateImportAttribution } from '../utils/libraryAnalytics';

interface PackConfirmOptions {
  allTemplates: { _id: Id<'templates'>; name: string }[] | undefined;
  importTemplate: (args: {
    source?: TemplateImportAttribution;
    templateId: Id<'templates'>;
  }) => Promise<{ alreadyExists?: boolean; success: boolean }>;
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
        const res = await o.importTemplate({
          source: 'pack',
          templateId: t._id,
        });
        if (res.success) {
          o.setImportedIds((prev) => new Set(prev).add(t._id));
          if (!res.alreadyExists) count++;
        }
      } catch {
        /* skip failed individual imports */
      }
    }
    setSelectedPack(null);
    if (count > 0) o.onComplete(count);
  }, [
    selectedPack,
    o.allTemplates,
    o.importTemplate,
    o.setImportedIds,
    o.onComplete,
  ]);

  return { handleCancel, handleConfirm, handlePackPress, selectedPack };
}
