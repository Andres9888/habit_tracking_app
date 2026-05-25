import type { Doc } from '../../../../../convex/_generated/dataModel';

export interface GuidedPickerViewProps {
  allTemplates: Doc<'templates'>[];
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onBack: () => void;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}
