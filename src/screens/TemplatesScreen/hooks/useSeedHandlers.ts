/**
 * Handlers for seeding templates
 */

import { useCallback } from 'react';

interface UseSeedHandlersOptions {
  seedTemplates: (args: Record<string, never>) => Promise<unknown>;
  setIsSeeding: React.Dispatch<React.SetStateAction<boolean>>;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  setToastMessage: React.Dispatch<React.SetStateAction<string>>;
}

export function useSeedHandlers(opts: UseSeedHandlersOptions) {
  const { seedTemplates, setIsSeeding, setShowToast, setToastMessage } = opts;

  const handleSeedTemplates = useCallback(async () => {
    setIsSeeding(true);
    try {
      await seedTemplates({});
      setToastMessage('Templates loaded successfully!');
      setShowToast(true);
    } catch (error) {
      if (__DEV__) console.error('Error seeding:', error);
      const isAuthError =
        error instanceof Error && error.message.includes('Unauthenticated');
      setToastMessage(
        isAuthError ? 'Sign in to load templates.' : 'Failed to load templates.'
      );
      setShowToast(true);
    } finally {
      setIsSeeding(false);
    }
  }, [seedTemplates, setIsSeeding, setShowToast, setToastMessage]);

  return {
    handleSeedTemplates,
  };
}
