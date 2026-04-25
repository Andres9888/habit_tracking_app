/**
 * MainBrowseView — Goal-first browse surface
 *
 * Header → Search (sticky) → (Browse sections | Search results).
 * SearchBar is lifted above the body swap so it never remounts.
 */

import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  FadeOutUp,
} from 'react-native-reanimated';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { useThemeColors } from '../../../theme/ThemeContext';
import { durations } from '../../../theme/animations';
import { spacing } from '../../../theme/spacing';
import { styles } from '../../templates/templatesScreenStyles';
import { SearchBar } from '../components';
import { GoalCollectionGrid } from '../components/GoalCollectionGrid';
import { PopularSection } from '../components/PopularSection';
import type { MainBrowseViewProps } from './MainBrowseView.types';

const stagger = (index: number) =>
  FadeInDown.delay(index * durations.stagger)
    .duration(durations.enter)
    .easing(Easing.out(Easing.cubic));

const bodyEnter = FadeInDown.duration(180);
const bodyExit = FadeOutUp.duration(120);

const HEADER_SUBTITLE = 'Pick a path \u2014 habits proven to work.';

// Hidden for now \u2014 flip to true to restore the premium packs row.
// When re-enabling: bump Popular stagger to (3) and exploreAll to (4).
const SHOW_PREMIUM_PACKS = false;

export function MainBrowseView(p: MainBrowseViewProps) {
  const { colors } = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        leftAction={null}
        subtitle={HEADER_SUBTITLE}
        title='What do you want to work on?'
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
      {p.isSearchActive ? (
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: spacing['2xl'],
              paddingTop: spacing.md,
            }}
          >
            <Animated.View entering={stagger(1)}>
              <GoalCollectionGrid
                featuredBadgeLabel={p.featuredBadgeLabel}
                featuredGoalId={p.featuredGoalId}
                featuredStarterTemplates={p.featuredStarterTemplates}
                habitCountsByGoalId={p.habitCountsByGoalId}
                onPreviewStarter={p.onPreview}
                onSelectGoal={p.onGoalSelect}
              />
            </Animated.View>
            {SHOW_PREMIUM_PACKS ? (
              <Animated.View entering={stagger(2)}>
                {p.premiumPacksSection}
              </Animated.View>
            ) : null}
            <Animated.View entering={stagger(2)}>
              <PopularSection
                importedTemplateIds={p.importedTemplateIds}
                importingTemplateId={p.importingTemplateId}
                templates={p.popularTemplates}
                onImport={p.onImport}
                onPreview={p.onPreview}
                onSeeAll={p.onSeeAll}
              />
            </Animated.View>
            <Animated.View entering={stagger(3)}>
              {p.exploreAllSection}
            </Animated.View>
          </ScrollView>
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
