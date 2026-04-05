/**
 * MainBrowseView - curated browse surface for rapid habit discovery
 *
 * Layout: ScreenHeader → SearchBar → QuickFilterChips
 * → FeaturedCollection → PopularSection → CategoryGrid → PremiumPacksSection
 */

import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { useThemeColors } from '../../../theme/ThemeContext';
import { durations, springs } from '../../../theme/animations';
import { spacing } from '../../../theme/spacing';
import { styles } from '../../templates/templatesScreenStyles';
import { QuickFilterChips, SearchBar } from '../components';
import { FeaturedCollection } from '../components/FeaturedCollection';
import { PopularSection } from '../components/PopularSection';
import type { MainBrowseViewProps } from './MainBrowseView.types';

const stagger = (index: number) =>
  FadeInDown.delay(index * durations.stagger)
    .duration(durations.enter)
    .springify()
    .damping(springs.standard.damping);

export function MainBrowseView(p: MainBrowseViewProps) {
  const { colors } = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        leftAction={null}
        subtitle='Start with a goal, a category, or a quick add'
        title='Habit Library'
      />
      <Animated.View style={[styles.searchSection, p.searchAnimatedStyle]}>
        <SearchBar
          inputHint='What do you want to improve?'
          value={p.searchQuery}
          onChangeText={p.onSearchChange}
          onClear={p.onSearchClear}
        />
      </Animated.View>
      <QuickFilterChips
        activeCategory={p.selectedQuickFilter}
        categories={p.quickFilterCategories}
        onSelectCategory={p.onSelectQuickFilter}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: spacing['2xl'],
          paddingTop: spacing.md,
        }}
      >
        <Animated.View entering={stagger(0)}>
          <FeaturedCollection onPress={p.onFeaturedPress} />
        </Animated.View>
        <Animated.View entering={stagger(1)}>
          <PopularSection
            importedTemplateIds={p.importedTemplateIds}
            importingTemplateId={p.importingTemplateId}
            templates={p.popularTemplates}
            onImport={p.onImport}
            onPreview={p.onPreview}
            onSeeAll={p.onSeeAll}
          />
        </Animated.View>
        <Animated.View entering={stagger(2)}>
          {p.categoryGrid}
        </Animated.View>
        <Animated.View entering={stagger(3)}>
          {p.premiumPacksSection}
        </Animated.View>
      </ScrollView>
      {p.modals}
      {p.feedbackOverlays}
    </View>
  );
}
