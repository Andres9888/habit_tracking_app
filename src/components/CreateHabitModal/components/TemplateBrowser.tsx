import { Animated, View } from 'react-native';
import type { CategoryFilter, HabitTemplate } from '../types';
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
    selectedCategory: string;
    handleCategoryPress: (category: string) => void;
    isLoadingTemplates: boolean;
    filteredTemplates: HabitTemplate[];
    handleTemplateSelect: (template: HabitTemplate) => void;
    closeTemplateBrowser: () => void;
    handleHeroPress: () => void;
    handleTemplateListScroll: (event: any) => void;
    handleTemplateListContentSizeChange: (width: number, height: number) => void;
    handleTemplateListLayout: (event: any) => void;
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
        isEditMode={isEditMode}
        isOpen={isTemplateBrowserOpen}
        chevronRotation={chevronRotation}
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
            templates={filteredTemplates}
            onSelectTemplate={handleTemplateSelect}
            onViewScience={onViewScience}
            onClose={closeTemplateBrowser}
            onScroll={handleTemplateListScroll}
            onContentSizeChange={handleTemplateListContentSizeChange}
            onLayout={handleTemplateListLayout}
            showTopShadow={showTemplateTopShadow}
            showBottomShadow={showTemplateBottomShadow}
          />
        </Animated.View>
      )}
    </View>
  );
};
