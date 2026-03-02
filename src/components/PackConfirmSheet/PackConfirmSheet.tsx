/**
 * PackConfirmSheet - Bottom sheet for confirming pack import (premium users)
 */

import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { borderRadius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import type { PackConfirmSheetProps } from './PackConfirmSheet.types';

export function PackConfirmSheet({ onCancel, onConfirm, pack, visible }: PackConfirmSheetProps) {
  if (!pack) return null;

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onCancel}>
      <Pressable style={s.backdrop} onPress={onCancel} />
      <View testID="templates-pack-confirm" style={s.sheet}>
        <View style={s.handle} />
        <Text style={s.title}>{pack.name}</Text>
        <Text style={s.desc}>{pack.habits.length} habits will be added</Text>
        {pack.habits.map((h, i) => (
          <Animated.View key={i} testID={`templates-pack-confirm-item-${i}`} entering={FadeIn.delay(i * 200)} style={s.row}>
            <Text style={s.emoji}>{h.emoji}</Text>
            <View style={s.rowContent}>
              <Text style={s.habitName}>{h.name}</Text>
              <Text style={s.freq}>{h.frequency}</Text>
            </View>
            <View testID={`templates-pack-confirm-check-${i}`} style={s.check}>
              <Check color={colors.primary[600]} size={16} strokeWidth={3} />
            </View>
          </Animated.View>
        ))}
        <View style={s.buttons}>
          <Pressable testID="templates-pack-confirm-cancel" style={s.cancelBtn} onPress={onCancel}>
            <Text style={s.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable testID="templates-pack-confirm-add-all" style={s.addBtn} onPress={onConfirm}>
            <Text style={s.addText}>Add All {pack.habits.length}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  addBtn: { backgroundColor: colors.primary[600], borderRadius: borderRadius.medium, flex: 1, paddingVertical: spacing.md },
  addText: { ...typography.bodySmall, color: '#fff', fontWeight: '700', textAlign: 'center' },
  backdrop: { backgroundColor: 'rgba(0,0,0,0.4)', flex: 1 },
  buttons: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  cancelBtn: { backgroundColor: colors.surfaceMuted, borderRadius: borderRadius.medium, flex: 1, paddingVertical: spacing.md },
  cancelText: { ...typography.bodySmall, color: colors.text.secondary, fontWeight: '600', textAlign: 'center' },
  check: { alignItems: 'center', backgroundColor: `${colors.primary[600]}15`, borderRadius: 12, height: 24, justifyContent: 'center', width: 24 },
  desc: { ...typography.bodySmall, color: colors.text.secondary, marginBottom: spacing.md },
  emoji: { fontSize: 24 },
  freq: { ...typography.caption, color: colors.text.tertiary },
  habitName: { ...typography.bodySmall, color: colors.text.primary, fontWeight: '600' },
  handle: { alignSelf: 'center', backgroundColor: '#D1D5DB', borderRadius: 2, height: 4, marginBottom: spacing.base, width: 40 },
  row: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.sm },
  rowContent: { flex: 1 },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl, padding: spacing.lg, paddingTop: spacing.md },
  title: { ...typography.heading3, color: colors.text.primary, marginBottom: 4 },
});
