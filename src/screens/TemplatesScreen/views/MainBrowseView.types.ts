/**
 * Props for MainBrowseView (Habit Library landing)
 */

import type { ReactNode } from 'react';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';

export interface MainBrowseViewProps {
  allTemplates: Doc<'templates'>[];
  feedbackOverlays: ReactNode;
  frozenImportedIds: Set<string>;
  importedTemplateIds: Set<string>;
  importingTemplateId: Id<'templates'> | null;
  modals: ReactNode;
  onClose: () => void;
  onPopularImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}
