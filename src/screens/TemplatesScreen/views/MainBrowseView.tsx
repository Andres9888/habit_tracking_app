/**
 * MainBrowseView - Fogg's B=MAP section ordering
 *
 * Ability-tier first (chips, trending), then Motivation-tier (For You, Hero),
 * then Browse-tier (packs, categories), then Peak-End footer.
 */

import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { useThemeColors } from '../../../theme/ThemeContext';
import { durations } from '../../../theme/animations';
import { styles } from '../../templates/templatesScreenStyles';
import { SearchBar } from '../components';
import { FeaturedCollection } from '../components/FeaturedCollection';
import { ForYouSection } from '../components/ForYouSection';
import { MotivationalFooter } from '../components/MotivationalFooter';
import { PopularSection } from '../components/PopularSection';
import {
  CHIP_CATEGORIES,
  QuickFilterChips,
} from '../components/QuickFilterChips';
import { getTemporalGreeting } from '../utils/getTemporalGreeting';
import type { MainBrowseViewProps } from './MainBrowseView.types';

const EMPTY_SET = new Set<string>();
const stagger = (index: number) =>
  FadeInDown.delay(index * durations.stagger).duration(durations.enter);

export function MainBrowseView(p: MainBrowseViewProps) {
  const { colors } = useThemeColors();
  const importingIds = useMemo(
    () => (p.importingTemplateId ? new Set([p.importingTemplateId]) : EMPTY_SET),
    [p.importingTemplateId],
  );
  const hasForYou = p.forYouRecommendations.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        leftAction={null}
        subtitle={getTemporalGreeting()}
        title='Import Habits'
      />
      <Animated.View style={[styles.searchSection, p.searchAnimatedStyle]}>
        <SearchBar
          value={p.searchQuery}
          onChangeText={p.onSearchChange}
          onClear={p.onSearchClear}
        />
      </Animated.View>
      <Animated.View entering={stagger(0)} style={{ marginTop: 8 }}>
        <QuickFilterChips
          activeCategory={p.activeChipCategory}
          categories={CHIP_CATEGORIES}
          onSelectCategory={p.onChipCategorySelect}
        />
      </Animated.View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
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
        {hasForYou && (
          <Animated.View entering={stagger(2)}>
            <ForYouSection
              importedIds={p.importedTemplateIds}
              importingIds={importingIds}
              recommendations={p.forYouRecommendations}
              onImport={p.onImport}
              onPreview={p.onPreview}
            />
          </Animated.View>
        )}
        <Animated.View entering={stagger(hasForYou ? 3 : 2)}>
          <FeaturedCollection onPress={p.onFeaturedPress} />
        </Animated.View>
        <Animated.View entering={stagger(hasForYou ? 4 : 3)}>
          {p.premiumPacksSection}
        </Animated.View>
        <Animated.View entering={stagger(hasForYou ? 5 : 4)}>
          {p.categoryGrid}
        </Animated.View>
        <Animated.View entering={stagger(hasForYou ? 6 : 5)}>
          <MotivationalFooter />
        </Animated.View>
      </ScrollView>
      {p.modals}
      {p.feedbackOverlays}
    </View>
  );
}
