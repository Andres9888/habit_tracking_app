/**
 * TipQuickActionsSheet Component
 * 
 * Bottom sheet modal with contextual quick actions for habit tips.
 * 
 * **Trigger:** Tap tip card in progress section (Today/Focus Day/Motivation tips)
 * 
 * **Display:**
 * - Sheet header with "Quick Actions" title and tip preview text
 * - List of contextual actions based on tip type:
 *   - Today tip: Review Progress, See Calendar, Adjust Schedule
 *   - Focus Day tip: Mark [Day] Complete, Review Habit, Skip [Day]
 *   - Motivation tip: Review Motivation, Edit Habit, View Science
 * - Close button in header
 * - Animated entrance for each action item (staggered)
 * 
 * **Actions:**
 * - Select quick action (executes action, closes sheet)
 * - Close sheet (tap X or backdrop)
 * 
 * **Modal Type:** Shared Modal component with 'bottomSheet' variant
 * 
 * **Lifecycle:**
 * - Opens: visible=true when tip card tapped
 * - Closes: onClose via action selection, close button, or backdrop tap
 * - Actions dynamically generated based on tip type and context
 * 
 * **Pattern:** Uses shared Modal (bottomSheet variant)
 * QuickAction items have icon, label, description
 * Respects reduce motion preference for animations
 * Haptic feedback on interactions
 */

import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { Modal } from '../../Modal';
import { useHapticFeedback } from '../../../hooks/useHapticFeedback';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import type { TipQuickActionsSheetProps, QuickAction } from './types';
import { getQuickActionsForTipType } from './getQuickActionsForTipType';
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
