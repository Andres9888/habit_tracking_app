/**
 * CategoryDrillView - Slide-in view showing templates for a single category
 */

import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { TemplateCard } from '../../../components/TemplateCard';
import { colors } from '../../../theme/colors';
import { durations, springs } from '../../../theme/animations';
import { spacing } from '../../../theme/spacing';
import { getCategoryMeta } from '../data/categoryMeta';

interface CategoryDrillViewProps {
  categoryId: string;
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onBack: () => void;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  templates: Doc<'templates'>[];
}

export function CategoryDrillView({
  categoryId, importedTemplateIds, importingTemplateId,
  onBack, onImport, onPreview, templates,
}: CategoryDrillViewProps) {
  const meta = getCategoryMeta(categoryId);
  const scienceCount = templates.filter((t) => t.scientificReference).length;

  return (
    <View testID="templates-category-view" style={s.container}>
      <ScreenHeader
        subtitle={`${templates.length} templates · ${scienceCount} science-backed`}
        title={`${meta.icon} ${meta.label}`}
        onBack={onBack}
      />
      <FlatList
        data={templates}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: spacing.base }}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * durations.stagger).duration(durations.enter).springify().damping(springs.standard.damping)}>
            <TemplateCard
              category={item.category}
              description={item.description}
              frequency={item.frequency}
              icon={item.icon}
              iconColor={item.iconColor}
              id={item._id}
              index={index}
              isImported={importedTemplateIds.has(item._id)}
              isImporting={importingTemplateId === item._id}
              name={item.name}
              popularityScore={item.popularityScore}
              scientificLink={item.scientificLink}
              scientificReference={item.scientificReference}
              showPreviewCTA
              youtubeLink={item.youtubeLink}
              onImport={() => onImport(item)}
              onPreview={() => onPreview(item)}
            />
          </Animated.View>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1 },
});
