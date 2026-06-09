/**
 * CategoryDrillView - Slide-in view showing templates for a single category.
 * Composes CategoryHero + DrillListBody; list logic lives in DrillListBody.
 */

import { StyleSheet, View } from 'react-native';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../theme/ThemeContext';
import { getCategoryMeta } from '../data/categoryMeta';
import { CategoryHero } from './CategoryHero';
import { DrillListBody } from './DrillListBody';

interface CategoryDrillViewProps {
  categoryId: string;
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onBack: () => void;
  onBrowseCategories?: () => void;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  templates: Doc<'templates'>[];
}

export function CategoryDrillView({
  categoryId,
  importedTemplateIds,
  importingTemplateId,
  onBack,
  onBrowseCategories,
  onImport,
  onPreview,
  templates,
}: CategoryDrillViewProps) {
  const { colors } = useThemeColors();
  const meta = getCategoryMeta(categoryId);

  return (
    <View
      testID='templates-category-view'
      style={[s.container, { backgroundColor: colors.background }]}
    >
      <CategoryHero habitCount={templates.length} meta={meta} onBack={onBack} />
      <DrillListBody
        chipColors={{
          bgColor: meta.bgColor,
          borderColor: meta.borderColor,
          textColor: meta.textColor,
        }}
        importedTemplateIds={importedTemplateIds}
        importingTemplateId={importingTemplateId}
        templates={templates}
        onBrowseCategories={onBrowseCategories}
        onImport={onImport}
        onPreview={onPreview}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
});
