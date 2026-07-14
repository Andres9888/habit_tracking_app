/**
 * Type definitions for TemplatesScreen handlers
 */

import type { Doc, Id } from '../../../convex/_generated/dataModel';
import type { TemplateToastData } from '../../components/TemplateAddedToast';
import type {
  TemplateCustomizations,
  TemplatePreviewAnchor,
} from './TemplatesScreen.types';
import type { TemplateImportAttribution } from './utils/libraryAnalytics';

export interface UseTemplateHandlersOptions {
  importTemplate: (args: {
    templateId: Id<'templates'>;
    customizations?: TemplateCustomizations;
    source?: TemplateImportAttribution;
  }) => Promise<{
    alreadyExists?: boolean;
    success: boolean;
    habitId?: Id<'habits'>;
  }>;
  isPremiumUser: boolean;
  onShowPaywall?: () => void;
  previewTemplate: Doc<'templates'> | null;
  seedTemplates: (args: Record<string, never>) => Promise<unknown>;
  setFeedbackHabitId: React.Dispatch<React.SetStateAction<Id<'habits'> | null>>;
  setFeedbackVariant: React.Dispatch<
    React.SetStateAction<'success' | 'already_exists' | null>
  >;
  setImportedTemplateIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  setImportingTemplateIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  setIsSeeding: React.Dispatch<React.SetStateAction<boolean>>;
  setPreviewInitialAnchor: React.Dispatch<
    React.SetStateAction<TemplatePreviewAnchor>
  >;
  setPreviewTemplate: React.Dispatch<
    React.SetStateAction<Doc<'templates'> | null>
  >;
  setSessionImportCount: React.Dispatch<React.SetStateAction<number>>;
  setShowCelebration: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCustomizeModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFullsizePreview: React.Dispatch<React.SetStateAction<boolean>>;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  userHabitCount: number;
  setToastMessage: React.Dispatch<React.SetStateAction<string>>;
  setToastOnAction: React.Dispatch<React.SetStateAction<(() => void) | null>>;
  setToastTemplateData: React.Dispatch<
    React.SetStateAction<TemplateToastData | null>
  >;
}
