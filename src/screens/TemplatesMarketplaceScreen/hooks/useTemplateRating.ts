/**
 * Hook for template rating functionality
 */

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import type { Id } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/hooks/useAuth';

interface UseTemplateRatingResult {
  rateTemplate: (templateId: Id<'templates'>, rating: number) => Promise<void>;
  isRating: boolean;
  ratingError: string | null;
}

export function useTemplateRating(): UseTemplateRatingResult {
  const { userId } = useAuth();
  const rateTemplateMutation = useMutation(api.rateTemplate);
  const [isRating, setIsRating] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);

  const rateTemplate = async (templateId: Id<'templates'>, rating: number) => {
    setIsRating(true);
    setRatingError(null);
    try {
      await rateTemplateMutation({
        templateId,
        rating,
        userId,
      });
    } catch (error) {
      setRatingError(error instanceof Error ? error.message : 'Failed to rate template');
      throw error;
    } finally {
      setIsRating(false);
    }
  };

  return {
    rateTemplate,
    isRating,
    ratingError,
  };
}

/**
 * Hook to get user's rating for a specific template
 */
export function useUserTemplateRating(templateId: Id<'templates'> | null) {
  const { userId } = useAuth();
  
  return useQuery(
    api.getUserTemplateRating,
    templateId ? { templateId, userId } : 'skip'
  ) as number | null;
}
