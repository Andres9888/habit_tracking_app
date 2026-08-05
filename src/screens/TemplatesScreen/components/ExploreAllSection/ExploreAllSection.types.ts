/**
 * Props for ExploreAllSection
 */

import type { Doc, Id } from '../../../../../convex/_generated/dataModel';

export interface CategoryGroup {
  category: string;
  icon: string;
  label: string;
  subtitle?: string;
  templates: Doc<'templates'>[];
}

export interface ExploreAllSectionProps {
  getCategoryLabel: (categoryId: string) => string;
  groups: CategoryGroup[];
  importedTemplateIds: Set<string>;
  importingTemplateId: Id<'templates'> | null;
  totalCount: number;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}
