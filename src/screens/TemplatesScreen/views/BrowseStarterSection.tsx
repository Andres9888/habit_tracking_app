/**
 * Starter / start-here block for first-time library browsers.
 */

import Animated from 'react-native-reanimated';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { StartHereCard } from '../components/StartHereCard';
import { StarterHabitList } from '../components/StarterHabitList';
import { browseStaggerIndex } from './BrowseSections.stagger';
import { stagger } from './MainBrowseView.helpers';

interface BrowseStarterSectionProps {
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  isFirstTimeUser: boolean;
  onBrowseByGoal: () => void;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onStartHerePress: () => void;
  recommendationCount: number;
  showStarterList: boolean;
  starterTemplates: Doc<'templates'>[];
}

export function BrowseStarterSection(p: BrowseStarterSectionProps) {
  const staggerOpts = {
    isFirstTimeUser: p.isFirstTimeUser,
    recommendationCount: p.recommendationCount,
    showStarterList: p.showStarterList,
  };

  if (p.showStarterList) {
    return (
      <Animated.View
        entering={stagger(
          browseStaggerIndex({ ...staggerOpts, section: 'starters' })
        )}
      >
        <StarterHabitList
          importedTemplateIds={p.importedTemplateIds}
          importingTemplateId={p.importingTemplateId}
          templates={p.starterTemplates}
          onBrowseByGoal={p.onBrowseByGoal}
          onImport={p.onImport}
          onPreview={p.onPreview}
        />
      </Animated.View>
    );
  }

  if (p.isFirstTimeUser) {
    return (
      <Animated.View entering={stagger(2)}>
        <StartHereCard onPress={p.onStartHerePress} />
      </Animated.View>
    );
  }

  return null;
}
