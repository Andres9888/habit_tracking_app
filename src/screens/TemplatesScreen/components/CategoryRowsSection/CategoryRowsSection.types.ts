/**
 * Props for CategoryRowsSection and CategoryRow.
 */

import type { Doc, Id } from '../../../../../convex/_generated/dataModel';
import type { CategoryGroup } from '../ExploreAllSection/ExploreAllSection.types';

export interface CategoryRowsSectionProps {
  groups: CategoryGroup[];
  importedTemplateIds: Set<string>;
  importingTemplateId: Id<'templates'> | null;
  totalCount: number;
  onBrowseAll: () => void;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onSeeAllRow: (categoryId: string) => void;
}

export interface CategoryRowProps {
  group: CategoryGroup;
  importedTemplateIds: Set<string>;
  importingTemplateId: Id<'templates'> | null;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onSeeAll: () => void;
}
