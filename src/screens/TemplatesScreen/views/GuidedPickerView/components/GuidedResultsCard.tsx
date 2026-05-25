import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';
import type { RankedTemplate } from '../../../utils/recommendation';
import type { Doc } from '../../../../../convex/_generated/dataModel';

interface GuidedResultsCardProps {
  ranked: RankedTemplate;
  rank: number;
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onPreview: (template: Doc<'templates'>) => void;
  onImport: (template: Doc<'templates'>) => void;
}

export function GuidedResultsCard({ ranked, rank, importedTemplateIds, importingTemplateId, onPreview, onImport }: GuidedResultsCardProps) {
  const { colors } = useThemeColors();
  const { template, whyThisMatches } = ranked;
  const isImported = importedTemplateIds.has(template._id);
  const isImporting = importingTemplateId === template._id;

  return (
    <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={s.header}>
        <View style={[s.rank, { backgroundColor: colors.primary[500] }]}>
          <Text style={s.rankLabel}>#{rank}</Text>
        </View>
        <Text style={s.icon}>{template.icon}</Text>
        <Text style={[s.name, { color: colors.text.primary }]} numberOfLines={1}>{template.name}</Text>
      </View>
      <Text style={[s.why, { color: colors.text.secondary }]}>{whyThisMatches}</Text>
      <View style={s.actions}>
        <Pressable style={[s.previewBtn, { borderColor: colors.primary[500] }]} onPress={() => onPreview(template)}>
          <Text style={[s.previewLabel, { color: colors.primary[600] }]}>Preview</Text>
        </Pressable>
        <Pressable disabled={isImported || isImporting} style={[s.addBtn, { backgroundColor: isImported ? colors.status.success : colors.primary[600] }]} onPress={() => onImport(template)}>
          <Text style={s.addLabel}>{isImported ? 'Added ✓' : isImporting ? '…' : 'Add'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  addBtn: { borderRadius: 10, flex: 1, paddingVertical: 10 },
  addLabel: { color: '#fff', fontSize: 14, fontWeight: '700', textAlign: 'center' },
  card: { borderRadius: 14, borderWidth: 1, marginBottom: 12, padding: 14 },
  header: { alignItems: 'center', flexDirection: 'row', marginBottom: 6 },
  icon: { fontSize: 24, marginRight: 8 },
  name: { flex: 1, fontSize: 16, fontWeight: '600' },
  previewBtn: { borderRadius: 10, borderWidth: 1.5, flex: 1, paddingVertical: 10 },
  previewLabel: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
  rank: { borderRadius: 8, marginRight: 8, paddingHorizontal: 6, paddingVertical: 2 },
  rankLabel: { color: '#fff', fontSize: 11, fontWeight: '700' },
  why: { fontSize: 13, lineHeight: 18 },
});
