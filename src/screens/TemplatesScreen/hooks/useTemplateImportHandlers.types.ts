/**
 * Types for useTemplateImportHandlers
 */

import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import type { TemplateToastData } from '../../../components/TemplateAddedToast';
import type { TemplateCustomizations } from '../TemplatesScreen.types';

export type ImportFn = (args: {
  templateId: Id<'templates'>;
  customizations?: TemplateCustomizations;
}) => Promise<{ success: boolean; alreadyExists?: boolean; habitId?: Id<'habits'> }>;

export interface UseTemplateImportHandlersOptions {
  importTemplate: ImportFn;
  previewTemplate: Doc<'templates'> | null;
  isPremiumUser: boolean;
  onShowPaywall?: () => void;
  setImportedTemplateIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  setImportingTemplateId: React.Dispatch<
    React.SetStateAction<Id<'templates'> | null>
  >;
  setPreviewTemplate: React.Dispatch<
    React.SetStateAction<Doc<'templates'> | null>
  >;
  setShowCustomizeModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCelebration: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFullsizePreview: React.Dispatch<React.SetStateAction<boolean>>;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  userHabitCount: number;
  setToastMessage: React.Dispatch<React.SetStateAction<string>>;
  setToastTemplateData: React.Dispatch<
    React.SetStateAction<TemplateToastData | null>
  >;
}
