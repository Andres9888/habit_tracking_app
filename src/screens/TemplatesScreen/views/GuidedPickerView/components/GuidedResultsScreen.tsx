import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';
import type { RankedTemplate } from '../../../utils/recommendation';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { GuidedResultsCard } from './GuidedResultsCard';

interface GuidedResultsScreenProps {
  results: RankedTemplate[];
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onPreview: (template: Doc<'templates'>) => void;
  onImport: (template: Doc<'templates'>) => void;
  onEditAnswers: () => void;
  onBrowseAll: () => void;
}

export function GuidedResultsScreen(p: GuidedResultsScreenProps) {
  const { colors } = useThemeColors();
  return (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={[s.heading, { color: colors.text.primary }]}>Your top matches</Text>
      {p.results.map((r, i) => (
        <GuidedResultsCard
          key={r.template._id}
          importedTemplateIds={p.importedTemplateIds}
          importingTemplateId={p.importingTemplateId}
          rank={i + 1}
          ranked={r}
          onImport={p.onImport}
          onPreview={p.onPreview}
        />
      ))}
      <Pressable style={s.linkBtn} onPress={p.onEditAnswers}>
        <Text style={[s.link, { color: colors.primary[600] }]}>Edit answers</Text>
      </Pressable>
      <Pressable style={s.linkBtn} onPress={p.onBrowseAll}>
        <Text style={[s.link, { color: colors.text.secondary }]}>Browse all habits instead</Text>
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { paddingBottom: 32, paddingHorizontal: 16 },
  heading: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  link: { fontSize: 14, textAlign: 'center' },
  linkBtn: { paddingVertical: 8 },
});
