import { useEffect } from 'react';

export function useSyncPremiumFlags(
  templates: ReadonlyArray<{ isPremium?: boolean }> | undefined,
  syncPremiumFlags: () => Promise<unknown>
) {
  useEffect(() => {
    if (!templates?.length) return;
    const needsSync = templates.some((template) => template.isPremium === undefined);
    if (needsSync) void syncPremiumFlags();
  }, [syncPremiumFlags, templates]);
}
