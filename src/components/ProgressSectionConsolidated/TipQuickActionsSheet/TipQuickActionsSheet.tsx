/**
 * TipQuickActionsSheet Component
 *
 * Bottom sheet modal with contextual quick actions for habit tips.
 */

import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { Modal } from '../../Modal';
import { useHapticFeedback } from '../../../hooks/useHapticFeedback';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import type {
  TipQuickActionsSheetProps,
  QuickAction,
} from '../TipQuickActionsSheetTypes';
import { getQuickActionsForTipType } from '../TipQuickActionsSheetTypes';
import { QuickActionItem } from './QuickActionItem';
import { styles } from './styles';

export const TipQuickActionsSheet = React.memo(function TipQuickActionsSheet({
  visible,
  tipText,
  tipType,
  focusDayName,
  currentStreak = 0,
  onActionPress,
  onClose,
}: TipQuickActionsSheetProps) {
  const reduceMotion = useReduceMotion();
  const { triggerLightImpact } = useHapticFeedback();

  const quickActions = useMemo(
    () => getQuickActionsForTipType(tipType, focusDayName, currentStreak),
    [tipType, focusDayName, currentStreak]
  );

  const handleActionPress = (action: QuickAction) => {
    onActionPress(action);
    onClose();
  };

  const handleClose = () => {
    triggerLightImpact();
    onClose();
  };

  return (
    <Modal
      disableGestureClose={false}
      variant='bottomSheet'
      visible={visible}
      onClose={onClose}
    >
      <View
        accessibilityLabel='Quick actions for tip'
        accessibilityRole='menu'
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Quick Actions</Text>
            <Text numberOfLines={2} style={styles.headerSubtitle}>
              {tipText}
            </Text>
          </View>
          <Pressable
            accessibilityLabel='Close quick actions'
            accessibilityRole='button'
            hitSlop={{ bottom: 12, left: 12, right: 12, top: 12 }}
            style={styles.closeButton}
            testID='close-quick-actions'
            onPress={handleClose}
          >
            <X color='#78716c' size={24} strokeWidth={2} />
          </Pressable>
        </View>

        <View style={styles.divider} />

        <View style={styles.actionsList}>
          {quickActions.map((action, index) => (
            <QuickActionItem
              key={action.id}
              action={action}
              index={index}
              reduceMotion={reduceMotion}
              onPress={handleActionPress}
            />
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </View>
    </Modal>
  );
});

export default TipQuickActionsSheet;
