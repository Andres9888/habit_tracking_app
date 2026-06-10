/**
 * MainBrowseView — Minimal & Clean browse surface
 */

import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from '../../templates/templatesScreenStyles';
import { LibraryHero } from '../components/LibraryHero';
import { QuickFilterChips } from '../components/QuickFilterChips';
import { BrowseSections } from './BrowseSections';
import { bodyEnter, bodyExit, stagger } from './MainBrowseView.helpers';
import type { MainBrowseViewProps } from './MainBrowseView.types';

export function MainBrowseView(p: MainBrowseViewProps) {
  const { colors } = useThemeColors();
  const isCategoryFilterActive = p.selectedCategory !== 'all';
  const showFilteredResults = p.isSearchActive || isCategoryFilterActive;
  const isFirstTimeUser = p.userHabitCount <= 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LibraryHero
        searchQuery={p.searchQuery}
        onSearchChange={p.onSearchChange}
        onSearchClear={p.onSearchClear}
      />
      {p.quickFilterCategories.length > 0 ? (
        <Animated.View entering={stagger(1)}>
          <QuickFilterChips
            activeCategory={isCategoryFilterActive ? p.selectedCategory : null}
            categories={p.quickFilterCategories}
            onSelectCategory={p.onSelectCategory}
          />
        </Animated.View>
      ) : null}
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
            browseCategoriesLink={p.browseCategoriesLink}
            featuredGoalId={p.featuredGoalId}
            featuredStarterTemplates={p.featuredStarterTemplates}
            habitCountsByGoalId={p.habitCountsByGoalId}
            importedTemplateIds={p.importedTemplateIds}
            importingTemplateId={p.importingTemplateId}
            isFirstTimeUser={isFirstTimeUser}
            onBrowseByGoal={p.onBrowseByGoal}
            onGoalSelect={p.onGoalSelect}
            onImport={p.onImport}
            onPreview={p.onPreview}
            onSeeAll={p.onSeeAll}
            onStartHerePress={p.onStartHerePress}
            rowSections={p.rowSections}
            startedCountsByGoalId={p.startedCountsByGoalId}
            starterTemplates={p.starterTemplates}
          />
        </Animated.View>
      )}
      {p.modals}
      {p.feedbackOverlays}
    </View>
  );
}

const s = StyleSheet.create({
  body: { flex: 1 },
});
