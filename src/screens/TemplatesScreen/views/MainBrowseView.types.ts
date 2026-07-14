/**
 * Props for MainBrowseView (Habit Library landing)
 */

import type { ReactNode } from 'react';
import type { Doc } from '../../../../convex/_generated/dataModel';

export interface MainBrowseViewProps {
  allTemplates: Doc<'templates'>[];
  catalogOrderImportedIds: Set<string>;
  feedbackOverlays: ReactNode;
  importedTemplateIds: Set<string>;
  importingTemplateIds: Set<string>;
  modals: ReactNode;
  onClose: () => void;
  onCatalogImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}
