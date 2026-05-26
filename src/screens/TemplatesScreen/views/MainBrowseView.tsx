/**
 * MainBrowseView — Goal-first browse surface
 */

import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from '../../templates/templatesScreenStyles';
import { SearchBar } from '../components';
import { QuickFilterChips } from '../components/QuickFilterChips';
import { SessionProgressPill } from '../components/SessionProgressPill';
import { getLibraryHeaderCopy } from '../utils/getLibraryHeaderCopy';
import { BrowseSections } from './BrowseSections';
import { bodyEnter, bodyExit, stagger } from './MainBrowseView.helpers';
import type { MainBrowseViewProps } from './MainBrowseView.types';

export function MainBrowseView(p: MainBrowseViewProps) {
  const { colors } = useThemeColors();
  const isCategoryFilterActive = p.selectedCategory !== 'all';
  const showFilteredResults = p.isSearchActive || isCategoryFilterActive;
  const isFirstTimeUser = p.userHabitCount <= 1;
  const headerCopy = getLibraryHeaderCopy(
    isFirstTimeUser,
    p.sessionImportCount
  );
  const searchHint = isFirstTimeUser
    ? 'Try: morning walk · journaling · cold shower'
    : 'Search by goal, habit name, or category';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        leftAction={null}
        rightAction={
          p.sessionImportCount > 0 ? (
            <SessionProgressPill count={p.sessionImportCount} />
          ) : undefined
        }
        subtitle={headerCopy.subtitle}
        title={headerCopy.title}
        titleNumberOfLines={2}
      />
      <Animated.View
        entering={stagger(0)}
        style={[styles.searchSection, p.searchAnimatedStyle]}
      >
        <SearchBar
          inputHint={searchHint}
          value={p.searchQuery}
          onChangeText={p.onSearchChange}
          onClear={p.onSearchClear}
        />
      </Animated.View>
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
            featuredBadgeLabel={p.featuredBadgeLabel}
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
            popularTemplates={p.popularTemplates}
            sessionImportCount={p.sessionImportCount}
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
