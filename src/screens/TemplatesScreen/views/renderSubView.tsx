/**
 * Renders sub-views (category drill, see-all) based on view navigation state
 */

import type { Doc } from '../../../../convex/_generated/dataModel';
import type { TemplateViewState } from '../hooks/useViewNavigation';
import { CategoryDrillView } from './CategoryDrillView';
import { SeeAllView } from './SeeAllView';

interface SubViewProps {
  activeView: TemplateViewState;
  allTemplates: Doc<'templates'>[] | undefined;
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onBack: () => void;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}

export function renderSubView(props: SubViewProps): JSX.Element | null {
  const { activeView, allTemplates = [], importedTemplateIds,
    importingTemplateId, onBack, onImport, onPreview } = props;
  const shared = { importedTemplateIds, importingTemplateId, onBack, onImport, onPreview };

  if (activeView.type === 'category') {
    const templates = allTemplates.filter((t) => t.category === activeView.categoryId);
    return <CategoryDrillView categoryId={activeView.categoryId} templates={templates} {...shared} />;
  }

  if (activeView.type === 'seeAll') {
    const sorted = [...allTemplates].sort((a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0));
    return <SeeAllView templates={sorted} {...shared} />;
  }

  return null;
}
