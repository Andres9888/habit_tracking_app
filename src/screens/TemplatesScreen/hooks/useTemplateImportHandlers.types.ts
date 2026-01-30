/**
 * Types for useTemplateImportHandlers
 */

import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import type { TemplateCustomizations } from '../TemplatesScreen.types';

export type ImportFn = (args: {
  templateId: Id<'templates'>;
  customizations?: TemplateCustomizations;
}) => Promise<{ success: boolean }>;

export interface UseTemplateImportHandlersOptions {
  importTemplate: ImportFn;
  setImportedTemplateIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  setImportingTemplateId: React.Dispatch<
    React.SetStateAction<Id<'templates'> | null>
  >;
  setPreviewTemplate: React.Dispatch<
    React.SetStateAction<Doc<'templates'> | null>
  >;
  setShowCustomizeModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFullsizePreview: React.Dispatch<React.SetStateAction<boolean>>;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  setToastMessage: React.Dispatch<React.SetStateAction<string>>;
}
