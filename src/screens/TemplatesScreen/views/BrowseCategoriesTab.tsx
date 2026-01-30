/**
 * Browse mode - Categories tab content
 */

import { ScrollView, View } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import CollapsibleCategorySection from '../../../components/CollapsibleCategorySection';
import { styles } from '../../templates/templatesScreenStyles';
import type { TemplateCustomizations } from '../TemplatesScreen.types';

interface CategoryData {
  icon: string;
  id: string;
  label: string;
}

interface BrowseCategoriesTabProps {
  categories: CategoryData[] | undefined;
  contentAnimatedStyle: AnimatedStyle;
  expandedCategories: Set<string>;
  handleTemplateImport: (
    templateId: Id<'templates'>,
    customizations?: TemplateCustomizations
  ) => Promise<void>;
  handleTemplatePreview: (template: Doc<'templates'>) => void;
  handleToggleCategory: (categoryId: string) => void;
  importingTemplateId: Id<'templates'> | null;
  scienceCountsByCategory: Record<string, number>;
  scrollViewRef: React.RefObject<ScrollView>;
  templatesByCategory: Map<string, Doc<'templates'>[]>;
}

export function BrowseCategoriesTab({
  categories,
  contentAnimatedStyle,
  expandedCategories,
  handleTemplateImport,
  handleTemplatePreview,
  handleToggleCategory,
  importingTemplateId,
  scienceCountsByCategory,
  scrollViewRef,
  templatesByCategory,
}: BrowseCategoriesTabProps) {
  return (
    <Animated.View style={[{ flex: 1 }, contentAnimatedStyle]}>
      <ScrollView
        ref={scrollViewRef}
        directionalLockEnabled
        nestedScrollEnabled
        contentContainerStyle={styles.browseContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.categorySections}>
          {categories
            ?.filter((cat) => cat.id !== 'all')
            .map((category) => {
              const templates = templatesByCategory.get(category.id) || [];
              if (templates.length === 0) return null;

              return (
                <CollapsibleCategorySection
                  key={category.id}
                  categoryId={category.id}
                  icon={category.icon}
                  importingTemplateId={importingTemplateId}
                  isExpanded={expandedCategories.has(category.id)}
                  label={category.label}
                  scienceCount={scienceCountsByCategory[category.id] || 0}
                  templates={templates}
                  onImport={(template) => handleTemplateImport(template._id)}
                  onTemplatePress={handleTemplatePreview}
                  onToggle={() => handleToggleCategory(category.id)}
                />
              );
            })}
        </View>
      </ScrollView>
    </Animated.View>
  );
}
