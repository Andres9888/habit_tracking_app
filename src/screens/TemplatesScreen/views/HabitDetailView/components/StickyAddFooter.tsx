import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../../theme/ThemeContext';

interface StickyAddFooterProps {
  isImported: boolean;
  isImporting: boolean;
  onAdd: () => void;
  onCustomize: () => void;
}

export function StickyAddFooter({ isImported, isImporting, onAdd, onCustomize }: StickyAddFooterProps) {
  const { colors } = useThemeColors();
  const btnColor = isImported ? colors.status.success : colors.primary[600];
  const label = isImported ? 'Added ✓' : isImporting ? 'Adding…' : 'Add Habit';
  return (
    <View style={[s.footer, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <Pressable disabled={isImported || isImporting} style={[s.addBtn, { backgroundColor: btnColor }]} onPress={onAdd}>
        <Text style={s.addLabel}>{label}</Text>
      </Pressable>
      <Pressable style={s.customizeBtn} onPress={onCustomize}>
        <Text style={[s.customizeLabel, { color: colors.primary[600] }]}>Customize</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  addBtn: { borderRadius: 14, flex: 1, marginRight: 8, paddingVertical: 14 },
  addLabel: { color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  customizeBtn: { paddingHorizontal: 12, paddingVertical: 14 },
  customizeLabel: { fontSize: 15, fontWeight: '600' },
  footer: { borderTopWidth: 1, flexDirection: 'row', padding: 16 },
});
