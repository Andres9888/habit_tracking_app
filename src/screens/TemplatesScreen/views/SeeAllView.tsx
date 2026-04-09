/**
 * SeeAllView - Full list of popular templates
 */

import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { useThemeColors } from '../../../theme/ThemeContext';
import { durations, springs } from '../../../theme/animations';
import { spacing } from '../../../theme/spacing';
import { getCategoryMeta } from '../data/categoryMeta';
import { TemplateListCard } from './TemplateListCard';

interface SeeAllViewProps {
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onBack: () => void;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  templates: Doc<'templates'>[];
}

export function SeeAllView({
  importedTemplateIds, importingTemplateId,
  onBack, onImport, onPreview, templates,
}: SeeAllViewProps) {
  const { colors } = useThemeColors();
  const getCategoryLabel = (categoryId: string) =>
    getCategoryMeta(categoryId).label;
  const habitCountLabel = `${templates.length} habit${templates.length === 1 ? '' : 's'}`;

  return (
    <View testID="templates-see-all-view" style={[s.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        subtitle={`${habitCountLabel} · sorted by popularity`}
        title="Trending habits"
        onBack={onBack}
      />
      <FlatList
        data={templates}
        contentContainerStyle={{
          paddingBottom: spacing['2xl'],
          paddingTop: spacing.xs,
        }}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * durations.stagger).duration(durations.enter).springify().damping(springs.standard.damping)}>
            <TemplateListCard
              getCategoryLabel={getCategoryLabel}
              importedTemplateIds={importedTemplateIds}
              importingTemplateId={importingTemplateId}
              item={item}
              searchQuery=''
              onImport={(_templateId) => onImport(item)}
              onPreview={(_template) => onPreview(item)}
            />
          </Animated.View>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
});
