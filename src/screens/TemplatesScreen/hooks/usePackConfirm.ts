/**
 * Hook for managing pack confirmation state and actions
 */

import { useCallback, useState } from 'react';
import type { PremiumPack } from '../data/premiumPacks';

export function usePackConfirm(
  isPremiumUser: boolean,
  showPaywall: () => void
) {
  const [selectedPack, setSelectedPack] = useState<PremiumPack | null>(null);

  const handlePackPress = useCallback(
    (pack: PremiumPack) => {
      if (isPremiumUser) {
        setSelectedPack(pack);
      } else {
        showPaywall();
      }
    },
    [isPremiumUser, showPaywall]
  );

  const handleCancel = useCallback(() => setSelectedPack(null), []);

  const handleConfirm = useCallback(() => {
    // TODO: iterate pack habits and call import for each
    setSelectedPack(null);
  }, []);

  return { handleCancel, handleConfirm, handlePackPress, selectedPack };
}
