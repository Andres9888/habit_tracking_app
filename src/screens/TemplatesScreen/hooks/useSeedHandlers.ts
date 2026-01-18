/**
 * Handlers for seeding templates
 */

import { useCallback } from 'react';

interface UseSeedHandlersOptions {
  seedAdditionalTemplates: (args: Record<string, never>) => Promise<void>;
  seedNewScienceTemplates: (args: Record<string, never>) => Promise<void>;
  seedTemplates: (args: Record<string, never>) => Promise<void>;
  setIsSeeding: React.Dispatch<React.SetStateAction<boolean>>;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  setToastMessage: React.Dispatch<React.SetStateAction<string>>;
}

export function useSeedHandlers(opts: UseSeedHandlersOptions) {
  const {
    seedAdditionalTemplates,
    seedNewScienceTemplates,
    seedTemplates,
    setIsSeeding,
    setShowToast,
    setToastMessage,
  } = opts;

  const handleSeedTemplates = useCallback(async () => {
    setIsSeeding(true);
    try {
      await seedTemplates({});
      await seedAdditionalTemplates({});
      await seedNewScienceTemplates({});
      setToastMessage('Templates loaded successfully!');
      setShowToast(true);
    } catch (error) {
      console.error('Error seeding:', error);
      setToastMessage('Failed to load templates.');
      setShowToast(true);
    } finally {
      setIsSeeding(false);
    }
  }, [
    seedAdditionalTemplates,
    seedNewScienceTemplates,
    seedTemplates,
    setIsSeeding,
    setShowToast,
    setToastMessage,
  ]);

  return {
    handleSeedTemplates,
  };
}
