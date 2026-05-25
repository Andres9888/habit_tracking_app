import type { Doc } from '../../../../../convex/_generated/dataModel';

export interface ImportSuccessViewProps {
  template: Doc<'templates'>;
  isFirstImport: boolean;
  allTemplates: Doc<'templates'>[];
  onOpenGuidedPicker: () => void;
  onCloseLibrary: () => void;
  onDismiss: () => void;
  onPreviewPairing: (template: Doc<'templates'>) => void;
  onAddPairing: (template: Doc<'templates'>) => void;
}
