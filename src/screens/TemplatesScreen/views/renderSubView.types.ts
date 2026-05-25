import type { Doc } from '../../../../convex/_generated/dataModel';
import type { TemplateViewState } from '../hooks/useViewNavigation';
import type { CategoryGridItem } from './CategoriesGridView';

export interface SubViewProps {
  activeView: TemplateViewState;
  allTemplates: Doc<'templates'>[] | undefined;
  categoryGridItems: CategoryGridItem[];
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onBack: () => void;
  onCustomize: (template: Doc<'templates'>) => void;
  onImport: (template: Doc<'templates'>) => void;
  onOpenCategory: (categoryId: string) => void;
  onOpenDetail: (templateId: string, sourcePath: string) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onTrackDetailOpen?: (templateId: string, sourcePath: string) => void;
}
