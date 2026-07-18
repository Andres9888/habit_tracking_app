/**
 * Types for TemplateListCard and its sub-components.
 */

import type { Doc, Id } from '../../../../../convex/_generated/dataModel';

export interface TemplateListCardProps {
  getCategoryLabel: (categoryId: string) => string;
  importedTemplateIds: Set<string>;
  isTopPick?: boolean;
  item: Doc<'templates'>;
  importingTemplateId: Id<'templates'> | null;
  popularityCount?: string | null;
  searchQuery: string;
  onImport: (templateId: Id<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}

export interface ListCardAddButtonProps {
  isImported: boolean;
  isImporting: boolean;
  name: string;
  /** 'compact' (default, 30px) keeps other cards untouched; 'regular' = mock-B 40px pill. */
  size?: 'compact' | 'regular';
  onImport: () => void;
}
