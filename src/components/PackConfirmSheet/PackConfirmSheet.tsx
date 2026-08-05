/**
 * PackConfirmSheet - Bottom sheet for confirming pack import (premium users)
 * Uses the shared Modal component with bottomSheet variant for consistent
 * dismiss gestures, backdrop animations, and spring configs.
 */

import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeIn } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import Modal from '../Modal';
import { iconSizes } from '@/theme/iconSizes';
import { colors } from '../../theme/colors';
import { borderRadius, spacing } from '../../theme/spacing';
import { typography, fontWeights } from '../../theme/typography';
import { ActionButtons } from './ActionButtons';
import type { PackConfirmSheetProps } from './PackConfirmSheet.types';

export function PackConfirmSheet({ onCancel, onConfirm, pack, visible }: PackConfirmSheetProps) {
  if (!pack) return null;

  return (
    <Modal variant="bottomSheet" visible={visible} onClose={onCancel}>
      <View testID="templates-pack-confirm">
        <Text style={s.title}>{pack.name}</Text>
        <Text style={s.desc}>{pack.habits.length} habits will be added</Text>
        {pack.habits.map((h, i) => (
          <Animated.View key={i} testID={`templates-pack-confirm-item-${i}`} entering={FadeIn.duration(280).delay(i * 60).easing(Easing.out(Easing.cubic))} style={s.row}>
            <Text style={s.emoji}>{h.emoji}</Text>
            <View style={s.rowContent}>
              <Text style={s.habitName}>{h.name}</Text>
              <Text style={s.freq}>{h.frequency}</Text>
            </View>
            <View testID={`templates-pack-confirm-check-${i}`} style={s.check}>
              <Check color={colors.primary[600]} size={iconSizes.small} strokeWidth={3} />
            </View>
          </Animated.View>
        ))}
        <ActionButtons count={pack.habits.length} onCancel={onCancel} onConfirm={onConfirm} />
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  check: { alignItems: 'center', backgroundColor: `${colors.primary[600]}15`, borderRadius: borderRadius.medium, height: 24, justifyContent: 'center', width: 24 },
  desc: { ...typography.bodySmall, color: colors.text.secondary, marginBottom: spacing.md },
  emoji: { fontSize: 22 },
  freq: { ...typography.caption, color: colors.text.tertiary },
  habitName: { ...typography.bodySmall, color: colors.text.primary, fontWeight: fontWeights.semibold },
  row: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.sm },
  rowContent: { flex: 1 },
  title: { ...typography.heading3, color: colors.text.primary, marginBottom: 4 },
});
