/**
 * Browse mode - View All tab content
 */

import { FlatList, Pressable, View } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import TemplateCard from '../../../components/TemplateCard';
import type { SortOption } from '../../templates/constants';
import { styles } from '../../templates/templatesScreenStyles';
import { FilterControls } from '../components';
import type { TemplateCustomizations } from '../TemplatesScreen.types';

interface BrowseAllTabProps {
  contentAnimatedStyle: AnimatedStyle;
  filteredTemplates: Doc<'templates'>[];
  handleSelectSortOption: (option: SortOption) => void;
  handleTemplateImport: (
    id: Id<'templates'>,
    c?: TemplateCustomizations
  ) => Promise<void>;
  handleTemplatePreview: (template: Doc<'templates'>) => void;
  importingTemplateId: Id<'templates'> | null;
  onCloseSortOptions: () => void;
  researchOnly: boolean;
  setResearchOnly: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSortOptions: React.Dispatch<React.SetStateAction<boolean>>;
  showSortOptions: boolean;
  sortOption: SortOption;
}

export function BrowseAllTab(p: BrowseAllTabProps) {
  const toggle = () => p.setResearchOnly((prev) => !prev);

  return (
    <Animated.View style={[{ flex: 1 }, p.contentAnimatedStyle]}>
      <View style={styles.filterControlsRow}>
        <FilterControls
          researchOnly={p.researchOnly}
          showSortOptions={p.showSortOptions}
          sortOption={p.sortOption}
          onResearchToggle={toggle}
          onSelectSort={p.handleSelectSortOption}
          onToggleSortOptions={() => p.setShowSortOptions((prev) => !prev)}
        />
      </View>
      <FlatList
        removeClippedSubviews
        contentContainerStyle={styles.allTemplatesList}
        data={p.filteredTemplates}
        keyboardDismissMode='on-drag'
        keyboardShouldPersistTaps='handled'
        initialNumToRender={5}
        keyExtractor={(item) => item._id}
        maxToRenderPerBatch={5}
        renderItem={({ item: t }) => (
          <TemplateCard
            key={t._id}
            enableScrollReveal
            animationIndex={0}
            category={t.category}
            description={t.description}
            frequency={t.frequency}
            icon={t.icon}
            iconColor={t.iconColor}
            id={t._id}
            isImporting={p.importingTemplateId === t._id}
            name={t.name}
            popularityScore={t.popularityScore}
            scientificLink={t.scientificLink}
            scientificReference={t.scientificReference}
            youtubeLink={t.youtubeLink}
            onImport={() => p.handleTemplateImport(t._id)}
            onPreview={() => p.handleTemplatePreview(t)}
          />
        )}
        showsVerticalScrollIndicator={false}
        windowSize={5}
      />
      {p.showSortOptions && (
        <Pressable
          accessibilityLabel='Close sort options'
          accessibilityRole='button'
          style={styles.dropdownBackdrop}
          onPress={p.onCloseSortOptions}
        />
      )}
    </Animated.View>
  );
}
