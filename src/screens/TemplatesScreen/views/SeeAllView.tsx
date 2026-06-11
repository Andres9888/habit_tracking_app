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
import { sortTemplatesByImportState } from '../utils/sortTemplatesByImportState';
import { HabitTemplateCard } from '../components/HabitTemplateCard';

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
            <HabitTemplateCard
              descriptionLines={3}
              isImported={importedTemplateIds.has(item._id)}
              isImporting={importingTemplateId === item._id}
              item={item}
              onImport={onImport}
              onPreview={onPreview}
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
