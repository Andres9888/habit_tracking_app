/**
 * Renders sub-views (category drill, goal drill, see-all) based on view state
 */

import type { ReactElement } from 'react';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { GOAL_COLLECTIONS } from '../data/goalCollections';
import type { TemplateViewState } from '../hooks/useViewNavigation';
import { CategoryDrillView } from './CategoryDrillView';
import { GoalDrillView } from './GoalDrillView';
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

export function renderSubView(props: SubViewProps): ReactElement | null {
  const { activeView, allTemplates = [], importedTemplateIds,
    importingTemplateId, onBack, onImport, onPreview } = props;
  const shared = { importedTemplateIds, importingTemplateId, onBack, onImport, onPreview };

  if (activeView.type === 'category') {
    const templates = allTemplates.filter((t) => t.category === activeView.categoryId);
    return <CategoryDrillView categoryId={activeView.categoryId} templates={templates} {...shared} />;
  }

  if (activeView.type === 'goal') {
    const goal = GOAL_COLLECTIONS.find((g) => g.id === activeView.goalId);
    if (!goal) return null;
    const templates = allTemplates.filter((t) => goal.categories.includes(t.category));
    return <GoalDrillView goal={goal} templates={templates} {...shared} />;
  }

  if (activeView.type === 'seeAll') {
    const sorted = [...allTemplates].sort((a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0));
    return <SeeAllView templates={sorted} {...shared} />;
  }

  return null;
}
