/**
 * CollapsibleCategorySection Types
 */

import type { Doc } from '../../../convex/_generated/dataModel';

export interface CollapsibleCategorySectionProps {
  /** Category ID */
  categoryId: string;
  /** Category label */
  label: string;
  /** Category icon emoji */
  icon: string;
  /** Templates in this category */
  templates: Doc<'templates'>[];
  /** Number of science-backed templates in this category */
  scienceCount?: number;
  /** Is section expanded */
  isExpanded: boolean;
  /** Toggle expand callback */
  onToggle: () => void;
  /** Template tap callback */
  onTemplatePress: (template: Doc<'templates'>) => void;
  /** Set of already-imported template IDs */
  importedTemplateIds?: Set<string>;
  /** Import template callback */
  onImport: (template: Doc<'templates'>) => void;
  /** Currently importing template ID */
  importingTemplateId?: string | null;
  /** Is the user a premium user */
  isPremiumUser?: boolean;
}

export interface CategoryColors {
  bg: string;
  bgSelected: string;
}
