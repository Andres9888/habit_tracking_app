import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

/**
 * Hook to check premium status and manage premium features
 */
export const usePremium = () => {
  const settings = useQuery(api.settings.get);
  const isPremium = settings?.hasPremium ?? false;

  return {
    isPremium,
    isLoading: settings === undefined,
  };
};
