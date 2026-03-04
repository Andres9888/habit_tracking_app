/**
 * MainBrowseView - Curated main screen replacing the old tab-based BrowseView
 *
 * Layout: ScreenHeader → SearchBar → FeaturedCollection
 * → PopularSection → PremiumPacksSection → CategoryGrid
 */

import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { useThemeColors } from '../../../theme/ThemeContext';
import { durations } from '../../../theme/animations';
import { styles } from '../../templates/templatesScreenStyles';
import { SearchBar } from '../components';
import { FeaturedCollection } from '../components/FeaturedCollection';
import { PopularSection } from '../components/PopularSection';
import type { MainBrowseViewProps } from './MainBrowseView.types';

const stagger = (index: number) =>
  FadeInDown.delay(index * durations.stagger).duration(durations.enter);

export function MainBrowseView(p: MainBrowseViewProps) {
  const { colors } = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        leftAction={null}
        subtitle='Science-backed templates to build great habits'
        title='Import Habits'
      />
      <Animated.View style={[styles.searchSection, p.searchAnimatedStyle]}>
        <SearchBar
          value={p.searchQuery}
          onChangeText={p.onSearchChange}
          onClear={p.onSearchClear}
        />
      </Animated.View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
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
          {p.premiumPacksSection}
        </Animated.View>
        <Animated.View entering={stagger(3)}>{p.categoryGrid}</Animated.View>
      </ScrollView>
      {p.modals}
      {p.feedbackOverlays}
    </View>
  );
}
