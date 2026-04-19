/**
 * MainBrowseView — Goal-first browse surface
 *
 * Frames habit discovery around user transformation:
 * Header → GoalCollectionGrid (hero) → Search → Trending → Curated Packs → Explore All
 */

import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { useThemeColors } from '../../../theme/ThemeContext';
import { durations, springs } from '../../../theme/animations';
import { spacing } from '../../../theme/spacing';
import { styles } from '../../templates/templatesScreenStyles';
import { SearchBar } from '../components';
import { GoalCollectionGrid } from '../components/GoalCollectionGrid';
import { PopularSection } from '../components/PopularSection';
import type { MainBrowseViewProps } from './MainBrowseView.types';

const stagger = (index: number) =>
  FadeInDown.delay(index * durations.stagger)
    .duration(durations.enter)
    .springify()
    .damping(springs.standard.damping);

const HEADER_SUBTITLE =
  'Pick a transformation. We\u2019ll suggest the science-backed habits to get you there.';

export function MainBrowseView(p: MainBrowseViewProps) {
  const { colors } = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        leftAction={null}
        subtitle={HEADER_SUBTITLE}
        title='What do you want to change?'
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: spacing['2xl'],
          paddingTop: spacing.md,
        }}
      >
        <Animated.View entering={stagger(0)}>
          <GoalCollectionGrid
            featuredBadgeLabel={p.featuredBadgeLabel}
            featuredGoalId={p.featuredGoalId}
            habitCountsByGoalId={p.habitCountsByGoalId}
            onSelectGoal={p.onGoalSelect}
          />
        </Animated.View>
        <Animated.View
          entering={stagger(1)}
          style={[styles.searchSection, p.searchAnimatedStyle]}
        >
          <SearchBar
            inputHint='Or search for a specific habit…'
            value={p.searchQuery}
            onChangeText={p.onSearchChange}
            onClear={p.onSearchClear}
          />
        </Animated.View>
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
          {p.premiumPacksSection}
        </Animated.View>
        <Animated.View entering={stagger(4)}>
          {p.exploreAllSection}
        </Animated.View>
      </ScrollView>
      {p.modals}
      {p.feedbackOverlays}
    </View>
  );
}
