/**
 * Renders sub-views based on view state (category drill, goal drill, see-all, detail, picker)
 */

import type { ReactElement } from 'react';
import { Text, View } from 'react-native';
import { GOAL_COLLECTIONS } from '../data/goalCollections';
import { filterStarterTemplates } from '../data/starterHabits';
import { CategoriesGridView } from './CategoriesGridView';
import { CategoryDrillView } from './CategoryDrillView';
import { GoalDrillView } from './GoalDrillView';
import { GuidedPickerView } from './GuidedPickerView';
import { HabitDetailView } from './HabitDetailView';
import type { SubViewProps } from './renderSubView.types';
import { SeeAllView } from './SeeAllView';
import { StarterHabitsView } from './StarterHabitsView';

export type { SubViewProps } from './renderSubView.types';

export function renderSubView(props: SubViewProps): ReactElement | null {
  const { activeView, allTemplates = [], categoryGridItems, importedTemplateIds, importingTemplateId, onBack, onCustomize, onImport, onOpenCategory, onPreview, onTrackDetailOpen } = props;
  const shared = { importedTemplateIds, importingTemplateId, onBack, onImport, onPreview };

  if (activeView.type === 'detail') {
    const template = allTemplates.find((t) => t._id === activeView.templateId);
    if (!template) return <View><Text>Template not found</Text></View>;
    return (
      <HabitDetailView
        importedTemplateIds={importedTemplateIds}
        importingTemplateId={importingTemplateId}
        sourcePath={activeView.sourcePath}
        template={template}
        onBack={onBack}
        onCustomize={onCustomize}
        onImport={onImport}
        onTrackOpen={onTrackDetailOpen}
      />
    );
  }

  if (activeView.type === 'guidedPicker') {
    return (
      <GuidedPickerView
        allTemplates={allTemplates}
        importedTemplateIds={importedTemplateIds}
        importingTemplateId={importingTemplateId}
        onBack={onBack}
        onImport={onImport}
        onPreview={onPreview}
      />
    );
  }

  if (activeView.type === 'starters') {
    return <StarterHabitsView templates={filterStarterTemplates(allTemplates)} {...shared} />;
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
