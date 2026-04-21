import type { Doc, Id } from '../../../../../convex/_generated/dataModel';

export interface TemplateListCardProps {
  getCategoryLabel: (categoryId: string) => string;
  importedTemplateIds: Set<string>;
  item: Doc<'templates'>;
  importingTemplateId: Id<'templates'> | null;
  searchQuery: string;
  onImport: (templateId: Id<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}
