import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';
import type { Doc } from '../../../../../convex/_generated/dataModel';

interface WhatsNextSectionProps {
  pairings: { template: Doc<'templates'>; reason: string }[];
  onPreview: (template: Doc<'templates'>) => void;
  onAdd: (template: Doc<'templates'>) => void;
}

export function WhatsNextSection({ pairings, onPreview, onAdd }: WhatsNextSectionProps) {
  const { colors } = useThemeColors();
  if (pairings.length === 0) return null;
  return (
    <View style={s.section}>
      <Text style={[s.heading, { color: colors.text.primary }]}>What's next?</Text>
      {pairings.map(({ template, reason }) => (
        <View key={template._id} style={[s.pairingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={s.icon}>{template.icon}</Text>
          <View style={s.info}>
            <Text style={[s.name, { color: colors.text.primary }]}>{template.name}</Text>
            <Text style={[s.reason, { color: colors.text.secondary }]}>{reason}</Text>
          </View>
          <View style={s.btns}>
            <Pressable onPress={() => onPreview(template)}>
              <Text style={[s.link, { color: colors.primary[600] }]}>Preview</Text>
            </Pressable>
            <Pressable style={[s.addBtn, { backgroundColor: colors.primary[600] }]} onPress={() => onAdd(template)}>
              <Text style={s.addLabel}>Add</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  addBtn: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  addLabel: { color: '#fff', fontSize: 13, fontWeight: '600' },
  btns: { alignItems: 'center', gap: 6 },
  heading: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  icon: { fontSize: 28, marginRight: 10 },
  info: { flex: 1 },
  link: { fontSize: 13, fontWeight: '500' },
  name: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  pairingCard: { alignItems: 'center', borderRadius: 12, borderWidth: 1, flexDirection: 'row', marginBottom: 10, padding: 12 },
  reason: { fontSize: 12 },
  section: { marginTop: 16, paddingHorizontal: 16 },
});
