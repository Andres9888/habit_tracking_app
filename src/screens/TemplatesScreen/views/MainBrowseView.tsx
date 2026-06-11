/**
 * MainBrowseView — The Guide browse surface: intake hero + short page
 */

import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from '../../templates/templatesScreenStyles';
import { LibraryHero } from '../components/LibraryHero';
import { BrowseSections } from './BrowseSections';
import { bodyEnter, bodyExit } from './MainBrowseView.helpers';
import type { MainBrowseViewProps } from './MainBrowseView.types';

export function MainBrowseView(p: MainBrowseViewProps) {
  const { colors } = useThemeColors();
  const isCategoryFilterActive = p.selectedCategory !== 'all';
  const showFilteredResults = p.isSearchActive || isCategoryFilterActive;
  const isFirstTimeUser = p.userHabitCount <= 1;
  const isCompressed = p.selectedGoalId !== null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LibraryHero
        heroSubtitle={p.heroSubtitle}
        heroTitle={p.heroTitle}
        importedStepCounts={p.importedStepCounts}
        isCompressed={isCompressed}
        searchQuery={p.searchQuery}
        selectedGoalId={p.selectedGoalId}
        onSearchChange={p.onSearchChange}
        onSearchClear={p.onSearchClear}
        onSelectGoal={p.onGoalSelect}
      />
      {showFilteredResults ? (
        <Animated.View
          key='results'
          entering={bodyEnter}
          exiting={bodyExit}
          style={s.body}
        >
          {p.searchResultsSection}
        </Animated.View>
      ) : (
        <Animated.View
          key='browse'
          entering={bodyEnter}
          exiting={bodyExit}
          style={s.body}
        >
          <BrowseSections
            categoryIndex={p.categoryIndex}
            goalTemplates={p.goalTemplates}
            importedTemplateIds={p.importedTemplateIds}
            importingTemplateId={p.importingTemplateId}
            isFirstTimeUser={isFirstTimeUser}
            prescription={p.prescription}
            rowSections={p.rowSections}
            selectedGoalId={p.selectedGoalId}
            starterTemplates={p.starterTemplates}
            totalHabitCount={p.totalHabitCount}
            onBrowseByGoal={p.onBrowseByGoal}
            onImport={p.onImport}
            onOpenCategory={p.onOpenCategory}
            onOpenGoal={p.onOpenGoal}
            onPreview={p.onPreview}
            onSeeAll={p.onSeeAll}
            onStartHerePress={p.onStartHerePress}
          />
        </Animated.View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  body: { flex: 1 },
});
