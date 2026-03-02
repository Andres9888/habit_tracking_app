/**
 * SeeAllView - Full list of popular templates
 */

import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { TemplateCard } from '../../../components/TemplateCard';
import { colors } from '../../../theme/colors';
import { durations } from '../../../theme/animations';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

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
  const insets = useSafeAreaInsets();

  return (
    <View testID="templates-see-all-view" style={[s.container, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <Pressable testID="templates-see-all-back" accessibilityLabel="Go back" accessibilityRole="button" hitSlop={8} onPress={onBack}>
          <ChevronLeft color={colors.text.primary} size={24} />
        </Pressable>
        <View style={s.headerContent}>
          <Text style={s.title}>All Popular Templates</Text>
          <Text style={s.subtitle}>
            {templates.length} templates · sorted by popularity
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
