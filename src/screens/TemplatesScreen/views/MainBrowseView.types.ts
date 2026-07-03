/**
 * Props for MainBrowseView (Habit Library landing)
 */

import type { ReactNode } from 'react';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';

export interface MainBrowseViewProps {
  allTemplates: Doc<'templates'>[];
  feedbackOverlays: ReactNode;
  importedTemplateIds: Set<string>;
  importingTemplateId: Id<'templates'> | null;
  modals: ReactNode;
  onPopularImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onSearchChange: (text: string) => void;
  onSearchClear: () => void;
  onSeeAll: () => void;
  searchQuery: string;
  totalHabitCount: number;
}
