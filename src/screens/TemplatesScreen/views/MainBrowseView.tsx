/**
 * MainBrowseView — Goal-first browse surface
 *
 * Header → Search (sticky) → Chips → (BrowseSections | Search results).
 * SearchBar and chips are lifted above the body swap so they never remount.
 */

import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from '../../templates/templatesScreenStyles';
import { SearchBar } from '../components';
import { QuickFilterChips } from '../components/QuickFilterChips';
import { BrowseSections } from './BrowseSections';
import { bodyEnter, bodyExit, stagger } from './MainBrowseView.helpers';
import type { MainBrowseViewProps } from './MainBrowseView.types';

const HEADER_SUBTITLE = 'Pick a path — habits proven to work.';

// Hidden for now — flip to true to restore the premium packs row.
// When re-enabling: review BrowseSections stagger indices to avoid collision.
const SHOW_PREMIUM_PACKS = false;

export function MainBrowseView(p: MainBrowseViewProps) {
  const { colors } = useThemeColors();
  const isCategoryFilterActive = p.selectedCategory !== 'all';
  const showFilteredResults = p.isSearchActive || isCategoryFilterActive;
  const showStartHere = p.userHabitCount <= 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        leftAction={null}
        subtitle={HEADER_SUBTITLE}
        title='What do you want to work on?'
        titleNumberOfLines={2}
      />
      <Animated.View
        entering={stagger(0)}
        style={[styles.searchSection, p.searchAnimatedStyle]}
      >
        <SearchBar
          inputHint='Try: morning walk · journaling · cold shower'
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
            exploreAllSection={p.exploreAllSection}
            featuredBadgeLabel={p.featuredBadgeLabel}
            featuredGoalId={p.featuredGoalId}
            featuredStarterTemplates={p.featuredStarterTemplates}
            habitCountsByGoalId={p.habitCountsByGoalId}
            importedTemplateIds={p.importedTemplateIds}
            importingTemplateId={p.importingTemplateId}
            onGoalSelect={p.onGoalSelect}
            onImport={p.onImport}
            onPreview={p.onPreview}
            onSeeAll={p.onSeeAll}
            onStartHerePress={p.onStartHerePress}
            popularTemplates={p.popularTemplates}
            premiumPacksSection={p.premiumPacksSection}
            showPremiumPacks={SHOW_PREMIUM_PACKS}
            showStartHere={showStartHere}
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
