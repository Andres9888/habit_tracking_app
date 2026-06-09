/**
 * ForYouSection — personalized recommendations rail with reason chips.
 */

import { FlatList, StyleSheet, Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';
import type { RecommendedTemplate } from '../../hooks/scoreRecommendedTemplates';
import { SectionHeader } from '../SectionHeader';
import { TrendingCard } from '../TrendingCard';

interface ForYouSectionProps {
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  recommendations: RecommendedTemplate[];
  weeklyImportCounts?: Record<string, number>;
}

export function ForYouSection({
  importedTemplateIds,
  importingTemplateId,
  onImport,
  onPreview,
  recommendations,
  weeklyImportCounts,
}: ForYouSectionProps) {
  const { colors } = useThemeColors();
  if (recommendations.length === 0) return null;

  return (
    <View testID='templates-for-you-section' style={s.container}>
      <SectionHeader
        subtitle='Picked from how you already track'
        title='For you'
      />
      <FlatList
        horizontal
        data={recommendations}
        contentContainerStyle={s.list}
        keyExtractor={(item) => item.template._id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={s.cardWrap}>
            <TrendingCard
              description={item.template.description}
              frequency={item.template.frequency}
              hasResearch={!!item.template.scientificReference}
              icon={item.template.icon}
              iconColor={item.template.iconColor}
              isImported={importedTemplateIds.has(item.template._id)}
              isImporting={importingTemplateId === item.template._id}
              name={item.template.name}
              weeklyImportCount={weeklyImportCounts?.[item.template._id]}
              onImport={() => onImport(item.template)}
              onPress={() => onPreview(item.template)}
              popularityScore={item.template.popularityScore ?? 0}
            />
            <View
              style={[
                s.reasonChip,
                {
                  backgroundColor: colors.status.premiumLight,
                  borderColor: colors.status.premiumText,
                },
              ]}
            >
              <Text
                numberOfLines={1}
                style={[s.reasonText, { color: colors.status.premiumText }]}
              >
                {item.reason}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  cardWrap: { gap: spacing.xs },
  container: { marginTop: spacing.base },
  list: { gap: spacing.md, paddingHorizontal: spacing.base },
  reasonChip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    marginTop: -2,
    maxWidth: 180,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  reasonText: { ...typography.caption, fontWeight: '600' },
});
