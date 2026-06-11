/**
 * StarterHabitsView — filtered list of the 5 curated starter habits.
 */

import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { useThemeColors } from '../../../theme/ThemeContext';
import { durations, enterEasing } from '../../../theme/animations';
import { spacing } from '../../../theme/spacing';
import { HabitTemplateCard } from '../components/HabitTemplateCard';

interface StarterHabitsViewProps {
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onBack: () => void;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  templates: Doc<'templates'>[];
}

export function StarterHabitsView({
  importedTemplateIds,
  importingTemplateId,
  onBack,
  onImport,
  onPreview,
  templates,
}: StarterHabitsViewProps) {
  const { colors } = useThemeColors();

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        subtitle='Under 5 min each · highest stick rate'
        title='Starter habits'
        onBack={onBack}
      />
      <FlatList
        data={templates}
        contentContainerStyle={s.list}
        keyExtractor={(item) => item._id}
        renderItem={({ index, item }) => (
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
  container: { flex: 1 },
  list: { paddingBottom: spacing['2xl'], paddingTop: spacing.xs },
});
