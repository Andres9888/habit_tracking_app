/**
 * Hook for PostImportSetupSheet business logic
 */

import { useState, useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { triggerHaptic } from '@/utils/haptics';

export function usePostImportSetup(
  habitId: Id<'habits'> | null,
  onClose: () => void
) {
  const updateHabit = useMutation(api.habits.update);
  const [cueAfterBehavior, setCueAfterBehavior] = useState('');
  const [why, setWhy] = useState('');
  const [identity, setIdentity] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const hasAnyInput = !!(
    cueAfterBehavior.trim() ||
    why.trim() ||
    identity.trim()
  );

  const handleSave = useCallback(async () => {
    if (!habitId || !hasAnyInput) return;
    setIsSaving(true);
    try {
      void triggerHaptic('toggle');
      const updates: Record<string, string> = {};
      if (cueAfterBehavior.trim())
        updates.cueAfterBehavior = cueAfterBehavior.trim();
      if (why.trim()) updates.why = why.trim();
      if (identity.trim()) updates.identity = identity.trim();

      await updateHabit({ habitId, ...updates });
      onClose();
    } catch {
      // Silently fail — user can set up later from the workshop
    } finally {
      setIsSaving(false);
    }
  }, [habitId, cueAfterBehavior, why, identity, hasAnyInput, updateHabit, onClose]);

  const handleSkip = useCallback(() => {
    void triggerHaptic('tap');
    onClose();
  }, [onClose]);

  const reset = useCallback(() => {
    setCueAfterBehavior('');
    setWhy('');
    setIdentity('');
  }, []);

  return {
    cueAfterBehavior,
    handleSave,
    handleSkip,
    hasAnyInput,
    identity,
    isSaving,
    reset,
    setCueAfterBehavior,
    setIdentity,
    setWhy,
    why,
  };
}
