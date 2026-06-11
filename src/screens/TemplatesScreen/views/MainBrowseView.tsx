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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LibraryHero
        searchQuery={p.searchQuery}
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
            importedTemplateIds={p.importedTemplateIds}
            importingTemplateId={p.importingTemplateId}
            isFirstTimeUser={isFirstTimeUser}
            onBrowseByGoal={p.onBrowseByGoal}
            onImport={p.onImport}
            onOpenCategory={p.onOpenCategory}
            onPreview={p.onPreview}
            onSeeAll={p.onSeeAll}
            onStartHerePress={p.onStartHerePress}
            rowSections={p.rowSections}
            starterTemplates={p.starterTemplates}
            totalHabitCount={p.totalHabitCount}
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
