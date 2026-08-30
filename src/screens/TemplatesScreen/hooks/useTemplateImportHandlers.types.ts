/**
 * Types for useTemplateImportHandlers
 */

import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import type { TemplateToastData } from '../../../components/TemplateAddedToast';
import type {
  TemplateCustomizations,
  TemplatePreviewAnchor,
} from '../TemplatesScreen.types';

export type ImportFn = (args: {
  templateId: Id<'templates'>;
  customizations?: TemplateCustomizations;
}) => Promise<{
  success: boolean;
  alreadyExists?: boolean;
  habitId?: Id<'habits'>;
}>;

export interface UseTemplateImportHandlersOptions {
  importTemplate: ImportFn;
  previewTemplate: Doc<'templates'> | null;
  isPremiumUser: boolean;
  onShowPaywall?: () => void;
  recordImportedHabitId: (
    templateId: Id<'templates'>,
    habitId: Id<'habits'>
  ) => void;
  setFeedbackHabitId: React.Dispatch<React.SetStateAction<Id<'habits'> | null>>;
  setFeedbackVariant: React.Dispatch<
    React.SetStateAction<'success' | 'already_exists' | null>
  >;
  setImportedTemplateIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  setImportingTemplateId: React.Dispatch<
    React.SetStateAction<Id<'templates'> | null>
  >;
  setPreviewInitialAnchor: React.Dispatch<
    React.SetStateAction<TemplatePreviewAnchor>
  >;
  setPreviewTemplate: React.Dispatch<
    React.SetStateAction<Doc<'templates'> | null>
  >;
  setSessionImportCount: React.Dispatch<React.SetStateAction<number>>;
  setShowCustomizeModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCelebration: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFullsizePreview: React.Dispatch<React.SetStateAction<boolean>>;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  userHabitCount: number;
  setToastMessage: React.Dispatch<React.SetStateAction<string>>;
  setToastOnAction: React.Dispatch<React.SetStateAction<(() => void) | null>>;
  setToastTemplateData: React.Dispatch<
    React.SetStateAction<TemplateToastData | null>
  >;
}
