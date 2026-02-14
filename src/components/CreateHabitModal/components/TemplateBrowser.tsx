import { Animated, View } from 'react-native';
import type { Category, CategoryFilter, HabitTemplate } from '../types';
import { CategoryFilters } from './CategoryFilters';
import { TemplateHero } from './TemplateHero';
import { TemplateList } from './TemplateList';

interface TemplateBrowserProps {
  isEditMode: boolean;
  template: {
    isTemplateBrowserOpen: boolean;
    isTemplateBrowserVisible: boolean;
    templateBrowserAnim: Animated.Value;
    templateBrowserTranslate: Animated.AnimatedInterpolation<number>;
    chevronRotation: Animated.AnimatedInterpolation<string>;
    categories: CategoryFilter[];
    selectedCategory: Category;
    handleCategoryPress: (category: Category) => void;
    isLoadingTemplates: boolean;
    filteredTemplates: HabitTemplate[];
    handleTemplateSelect: (template: HabitTemplate) => void;
    closeTemplateBrowser: () => void;
    handleHeroPress: () => void;
    handleTemplateListScroll: (event: unknown) => void;
    handleTemplateListContentSizeChange: (width: number, height: number) => void;
    handleTemplateListLayout: (event: unknown) => void;
    showTemplateTopShadow: boolean;
    showTemplateBottomShadow: boolean;
  };
  onViewScience: (template: HabitTemplate) => void;
}

export const TemplateBrowser = ({ isEditMode, template, onViewScience }: TemplateBrowserProps) => {
  const {
    isTemplateBrowserOpen,
    isTemplateBrowserVisible,
    templateBrowserAnim,
    templateBrowserTranslate,
    chevronRotation,
    categories,
    selectedCategory,
    handleCategoryPress,
    isLoadingTemplates,
    filteredTemplates,
    handleTemplateSelect,
    closeTemplateBrowser,
    handleHeroPress,
    handleTemplateListScroll,
    handleTemplateListContentSizeChange,
    handleTemplateListLayout,
    showTemplateTopShadow,
    showTemplateBottomShadow,
  } = template;

  return (
    <View>
      <TemplateHero
        chevronRotation={chevronRotation}
        isEditMode={isEditMode}
        isOpen={isTemplateBrowserOpen}
        onPress={handleHeroPress}
      />
      {isTemplateBrowserVisible && (
        <Animated.View
          className='mb-6 overflow-hidden rounded-3xl bg-white shadow-lg shadow-black/10'
          pointerEvents={isTemplateBrowserOpen ? 'auto' : 'none'}
          style={{ elevation: 2, opacity: templateBrowserAnim, transform: [{ translateY: templateBrowserTranslate }] }}
        >
          <CategoryFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={handleCategoryPress}
          />
          <TemplateList
            isLoading={isLoadingTemplates}
            showBottomShadow={showTemplateBottomShadow}
            showTopShadow={showTemplateTopShadow}
            templates={filteredTemplates}
            onClose={closeTemplateBrowser}
            onContentSizeChange={handleTemplateListContentSizeChange}
            onLayout={handleTemplateListLayout}
            onScroll={handleTemplateListScroll}
            onSelectTemplate={handleTemplateSelect}
            onViewScience={onViewScience}
          />
        </Animated.View>
      )}
    </View>
  );
};
