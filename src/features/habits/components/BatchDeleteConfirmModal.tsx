/**
 * BatchDeleteConfirmModal — Confirmation dialog before batch-deleting habits.
 */

import { memo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { colors as palette } from '../../../theme/colors';
import { useThemeColors } from '../../../theme/ThemeContext';
import { borderRadius } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';

interface BatchDeleteConfirmModalProps {
  visible: boolean;
  count: number;
  onCancel: () => void;
  onConfirm: () => void;
}

function BatchDeleteConfirmModalComponent({
  visible,
  count,
  onCancel,
  onConfirm,
}: BatchDeleteConfirmModalProps) {
  const { colors } = useThemeColors();

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onCancel}>
      <View style={s.overlay}>
        <View style={[s.box, { backgroundColor: colors.card }]}>
          <View style={s.iconWrap}>
            <AlertTriangle color={palette.error} size={iconSizes.large} strokeWidth={2} />
          </View>
          <Text style={[s.title, { color: colors.text.primary }]}>
            Delete {count} habit{count === 1 ? '' : 's'}?
          </Text>
          <Text style={[s.desc, { color: colors.text.secondary }]}>
            This will permanently remove the selected habits and all their tracking data. This
            cannot be undone.
          </Text>
          <View style={s.actions}>
            <Pressable style={[s.btn, s.cancelBtn]} onPress={onCancel}>
              <Text style={[s.btnText, { color: colors.text.primary }]}>Cancel</Text>
            </Pressable>
            <Pressable style={[s.btn, s.deleteBtn]} onPress={onConfirm}>
              <Text style={[s.btnText, { color: palette.text.inverse }]}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  actions: { flexDirection: 'row', gap: 10 },
  box: { borderRadius: borderRadius.xl, padding: 28, width: 320 },
  btn: { alignItems: 'center', borderRadius: borderRadius.button, flex: 1, paddingVertical: 12 },
  btnText: { ...typography.bodySmall, fontWeight: fontWeights.semibold },
  cancelBtn: { backgroundColor: 'rgba(255,255,255,0.08)' },
  deleteBtn: { backgroundColor: palette.error },
  desc: { ...typography.caption, lineHeight: 20, marginBottom: 24, textAlign: 'center' },
  iconWrap: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: palette.errorLight,
    borderRadius: borderRadius.xl,
    height: 48,
    justifyContent: 'center',
    marginBottom: 16,
    width: 48,
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
    justifyContent: 'center',
  },
  title: { ...typography.body, fontWeight: fontWeights.bold, marginBottom: 8, textAlign: 'center' },
});

export const BatchDeleteConfirmModal = memo(BatchDeleteConfirmModalComponent);
