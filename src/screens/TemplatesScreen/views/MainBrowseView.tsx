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
  const isCompressed = p.selectedGoalId !== null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LibraryHero
        heroSubtitle={p.heroSubtitle}
        heroTitle={p.heroTitle}
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
            prescription={p.prescription}
            rowSections={p.rowSections}
            selectedGoalId={p.selectedGoalId}
            totalHabitCount={p.totalHabitCount}
            onOpenCategory={p.onOpenCategory}
            onPopularImport={p.onPopularImport}
            onPrescriptionImport={p.onPrescriptionImport}
            onPreview={p.onPreview}
            onSeeAll={p.onSeeAll}
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
