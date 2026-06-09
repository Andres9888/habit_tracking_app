/**
 * SeeAllView - Full list of popular templates
 */

import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { useThemeColors } from '../../../theme/ThemeContext';
import { durations, enterEasing } from '../../../theme/animations';
import { spacing } from '../../../theme/spacing';
import { formatPopularityCount } from '../hooks/useDrillSections';
import { getCategoryMeta } from '../data/categoryMeta';
import { sortTemplatesByImportState } from '../utils/sortTemplatesByImportState';
import { DrillListEmptyState } from './DrillListEmptyState';
import { TemplateListCard } from './TemplateListCard';

const getCategoryLabel = (categoryId: string) =>
  getCategoryMeta(categoryId).label;

interface SeeAllViewProps {
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onBack: () => void;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  templates: Doc<'templates'>[];
}

export function SeeAllView({
  importedTemplateIds,
  importingTemplateId,
  onBack,
  onImport,
  onPreview,
  templates,
}: SeeAllViewProps) {
  const { colors } = useThemeColors();
  const sortedTemplates = sortTemplatesByImportState(
    templates,
    importedTemplateIds
  );
  const habitCountLabel = `${sortedTemplates.length} habit${sortedTemplates.length === 1 ? '' : 's'}`;

  if (sortedTemplates.length === 0) {
    return (
      <View
        testID='templates-see-all-view'
        style={[s.container, { backgroundColor: colors.background }]}
      >
        <ScreenHeader
          subtitle='No habits to show'
          title='Popular habits'
          onBack={onBack}
        />
        <DrillListEmptyState title='No popular habits yet' />
      </View>
    );
  }

  return (
    <View
      testID='templates-see-all-view'
      style={[s.container, { backgroundColor: colors.background }]}
    >
      <ScreenHeader
        subtitle={`${habitCountLabel} · sorted by popularity`}
        title='Popular habits'
        onBack={onBack}
      />
      <FlatList
        data={sortedTemplates}
        contentContainerStyle={{
          paddingBottom: spacing['2xl'],
          paddingTop: spacing.xs,
        }}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * durations.stagger)
              .duration(durations.enter)
              .easing(enterEasing)}
          >
            <TemplateListCard
              getCategoryLabel={getCategoryLabel}
              importedTemplateIds={importedTemplateIds}
              importingTemplateId={importingTemplateId}
              item={item}
              popularityCount={formatPopularityCount(item.popularityScore)}
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
