/**
 * ActionButtons - Cancel and Add All buttons for PackConfirmSheet
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius, spacing } from '../../theme/spacing';
import { typography, fontWeights } from '../../theme/typography';

interface ActionButtonsProps {
  count: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ActionButtons({ count, onCancel, onConfirm }: ActionButtonsProps) {
  return (
    <View style={s.buttons}>
      <Pressable testID="templates-pack-confirm-cancel" style={s.cancelBtn} onPress={onCancel}>
        <Text style={s.cancelText}>Cancel</Text>
      </Pressable>
      <Pressable testID="templates-pack-confirm-add-all" style={s.addBtn} onPress={onConfirm}>
        <Text style={s.addText}>Add All {count}</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  addBtn: { backgroundColor: colors.primary[600], borderRadius: borderRadius.medium, flex: 1, paddingVertical: spacing.md },
  addText: { ...typography.bodySmall, color: '#fff', fontWeight: fontWeights.bold, textAlign: 'center' },
  buttons: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg, paddingBottom: spacing.sm },
  cancelBtn: { backgroundColor: colors.light.surfaceMuted, borderRadius: borderRadius.medium, flex: 1, paddingVertical: spacing.md },
  cancelText: { ...typography.bodySmall, color: colors.text.secondary, fontWeight: fontWeights.semibold, textAlign: 'center' },
});
