/**
 * Hook for importing marketplace templates
 */

import { useState } from 'react';
import { useMutation } from 'convex/react';
import type { Id } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';

interface UseImportMarketplaceTemplateResult {
  importTemplate: (templateId: Id<'templates'>) => Promise<void>;
  isImporting: boolean;
  importError: string | null;
  successMessage: string | null;
}

export function useImportMarketplaceTemplate(): UseImportMarketplaceTemplateResult {
  const { userId } = useAuth();
  const router = useRouter();
  const importMutation = useMutation(api.importMarketplaceTemplate);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const importTemplate = async (templateId: Id<'templates'>) => {
    setIsImporting(true);
    setImportError(null);
    setSuccessMessage(null);
    try {
      const result = await importMutation({
        templateId,
        userId,
      });
      
      if (result.success) {
        setSuccessMessage(`Successfully imported ${result.habitCount} habits!`);
        // Navigate to home screen after successful import
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to import template');
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  return {
    importTemplate,
    isImporting,
    importError,
    successMessage,
  };
}
