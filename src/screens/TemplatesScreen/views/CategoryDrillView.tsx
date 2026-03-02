/**
 * CategoryDrillView - Slide-in view showing templates for a single category
 */

import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { TemplateCard } from '../../../components/TemplateCard';
import { colors } from '../../../theme/colors';
import { durations } from '../../../theme/animations';
import { borderRadius, spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
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
  const insets = useSafeAreaInsets();
  const meta = getCategoryMeta(categoryId);
  const scienceCount = templates.filter((t) => t.scientificReference).length;

  return (
    <View testID="templates-category-view" style={[s.container, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <Pressable testID="templates-category-back" accessibilityLabel="Go back" accessibilityRole="button" hitSlop={8} onPress={onBack}>
          <ChevronLeft color={colors.text.primary} size={24} />
        </Pressable>
        <View style={s.headerContent}>
          <Text testID="templates-category-view-title" style={s.title}>
            {meta.icon} {meta.label}
          </Text>
          <Text style={s.subtitle}>
            {templates.length} templates · {scienceCount} science-backed
          </Text>
        </View>
      </View>
      <FlatList
        data={templates}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: spacing.base }}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * durations.stagger).duration(durations.enter)}>
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
  header: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  headerContent: { flex: 1 },
  subtitle: { ...typography.caption, color: colors.text.tertiary },
  title: { ...typography.heading3, color: colors.text.primary },
});
