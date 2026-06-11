/**
 * Renders sub-views (category drill, goal drill, see-all) based on view state
 */

import type { ReactElement } from 'react';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { GOAL_COLLECTIONS } from '../data/goalCollections';
import type { TemplateViewState } from '../hooks/useViewNavigation';
import type { CategoryGridItem } from './CategoriesGridView';
import { CategoriesGridView } from './CategoriesGridView';
import { CategoryDrillView } from './CategoryDrillView';
import { GoalDrillView } from './GoalDrillView';
import { CatalogView } from './CatalogView';
import { StarterHabitsView } from './StarterHabitsView';
import { filterStarterTemplates } from '../data/starterHabits';

interface SubViewProps {
  activeView: TemplateViewState;
  allTemplates: Doc<'templates'>[] | undefined;
  categoryGridItems: CategoryGridItem[];
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onBack: () => void;
  onImport: (template: Doc<'templates'>) => void;
  onOpenCategory: (categoryId: string) => void;
  onPreview: (template: Doc<'templates'>) => void;
}

export function renderSubView(props: SubViewProps): ReactElement | null {
  const {
    activeView,
    allTemplates = [],
    categoryGridItems,
    importedTemplateIds,
    importingTemplateId,
    onBack,
    onImport,
    onOpenCategory,
    onPreview,
  } = props;
  const shared = {
    importedTemplateIds,
    importingTemplateId,
    onBack,
    onImport,
    onPreview,
  };

  if (activeView.type === 'starters') {
    return (
      <StarterHabitsView
        templates={filterStarterTemplates(allTemplates)}
        {...shared}
      />
    );
  }

  if (activeView.type === 'categories') {
    return (
      <CategoriesGridView
        categories={categoryGridItems}
        onBack={onBack}
        onSelectCategory={onOpenCategory}
      />
    );
  }

  if (activeView.type === 'category') {
    const templates = allTemplates.filter(
      (t) => t.category === activeView.categoryId
    );
    return (
      <CategoryDrillView
        categoryId={activeView.categoryId}
        templates={templates}
        {...shared}
      />
    );
  }

  if (activeView.type === 'goal') {
    const goal = GOAL_COLLECTIONS.find((g) => g.id === activeView.goalId);
    if (!goal) return null;
    const templates = allTemplates.filter((t) =>
      goal.categories.includes(t.category)
    );
    return <GoalDrillView goal={goal} templates={templates} {...shared} />;
  }

  if (activeView.type === 'catalog') {
    return (
      <CatalogView
        allTemplates={allTemplates}
        initialCategoryId={activeView.initialCategoryId}
        {...shared}
      />
    );
  }

  return null;
}
