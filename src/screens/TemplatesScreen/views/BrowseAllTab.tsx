/**
 * Browse mode - View All tab content
 */

import { FlatList, Pressable, View } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import TemplateCard from '../../../components/TemplateCard';
import type { SortOption } from '../../templates/constants';
import { styles } from '../../templates/templatesScreenStyles';
import { FilterControls, ResearchFilterButton } from '../components';
import type { TemplateCustomizations } from '../TemplatesScreen.types';

interface BrowseAllTabProps {
  contentAnimatedStyle: AnimatedStyle;
  filteredTemplates: Doc<'templates'>[];
  handleSelectSortOption: (option: SortOption) => void;
  handleTemplateImport: (
    templateId: Id<'templates'>,
    customizations?: TemplateCustomizations
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

export function BrowseAllTab({
  contentAnimatedStyle,
  filteredTemplates,
  handleSelectSortOption,
  handleTemplateImport,
  handleTemplatePreview,
  importingTemplateId,
  onCloseSortOptions,
  researchOnly,
  setResearchOnly,
  setShowSortOptions,
  showSortOptions,
  sortOption,
}: BrowseAllTabProps) {
  return (
    <Animated.View style={[{ flex: 1 }, contentAnimatedStyle]}>
      <View style={styles.filterControlsRow}>
        <FilterControls
          researchOnly={researchOnly}
          showSortOptions={showSortOptions}
          sortOption={sortOption}
          onResearchToggle={() => setResearchOnly((prev) => !prev)}
          onSelectSort={handleSelectSortOption}
          onToggleSortOptions={() => setShowSortOptions((prev) => !prev)}
        />
        <ResearchFilterButton
          label='Science-Backed'
          researchOnly={researchOnly}
          onToggle={() => setResearchOnly((prev) => !prev)}
        />
      </View>
      <FlatList
        contentContainerStyle={styles.allTemplatesList}
        data={filteredTemplates}
        initialNumToRender={5}
        keyExtractor={(item) => item._id}
        maxToRenderPerBatch={5}
        renderItem={({ item: template }) => (
          <TemplateCard
            key={template._id}
            enableScrollReveal
            animationIndex={0}
            category={template.category}
            description={template.description}
            frequency={template.frequency}
            icon={template.icon}
            iconColor={template.iconColor}
            id={template._id}
            isImporting={importingTemplateId === template._id}
            name={template.name}
            popularityScore={template.popularityScore}
            scientificLink={template.scientificLink}
            scientificReference={template.scientificReference}
            youtubeLink={template.youtubeLink}
            onImport={() => handleTemplateImport(template._id)}
            onPreview={() => handleTemplatePreview(template)}
          />
        )}
        showsVerticalScrollIndicator={false}
        windowSize={5}
      />
      {showSortOptions && (
        <Pressable
          style={styles.dropdownBackdrop}
          onPress={onCloseSortOptions}
        />
      )}
    </Animated.View>
  );
}
