/**
 * Renders sub-views (catalog) based on view state
 */

import type { ReactElement } from 'react';
import type { Doc } from '../../../../convex/_generated/dataModel';
import type { TemplateViewState } from '../hooks/useViewNavigation';
import { CatalogView } from './CatalogView';

interface SubViewProps {
  activeView: TemplateViewState;
  allTemplates: Doc<'templates'>[] | undefined;
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onBack: () => void;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}

export function renderSubView(props: SubViewProps): ReactElement | null {
  const {
    activeView,
    allTemplates = [],
    importedTemplateIds,
    importingTemplateId,
    onBack,
    onImport,
    onPreview,
  } = props;

  if (activeView.type === 'catalog') {
    return (
      <CatalogView
        allTemplates={allTemplates}
        initialCategoryId={activeView.initialCategoryId}
        importedTemplateIds={importedTemplateIds}
        importingTemplateId={importingTemplateId}
        onBack={onBack}
        onImport={onImport}
        onPreview={onPreview}
      />
    );
  }

  return null;
}
