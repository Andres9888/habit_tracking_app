/**
 * TipQuickActionsSheet Component
 *
 * Bottom sheet displaying contextual quick actions for the ActionableTipCard.
 * Actions are determined by the tip type and allow users to take immediate
 * action on their habits.
 *
 * Features:
 * - Bottom sheet modal with smooth animations
 * - Context-aware quick actions per tip type
 * - Icon + label + subtitle for each action
 * - Haptic feedback on action press
 * - Full accessibility support
 * - Respects reduceMotion preference
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
  Bell,
  Edit3,
  Calendar,
  Target,
  Heart,
  Zap,
  X,
} from 'lucide-react-native';

import { Modal } from '../Modal';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useReduceMotion } from '../../hooks/useReduceMotion';

import type {
  TipQuickActionsSheetProps,
  QuickAction,
} from './TipQuickActionsSheetTypes';
import { getQuickActionsForTipType } from './TipQuickActionsSheetTypes';

/**
 * Icon mapping for quick actions
 */
const ICON_MAP = {
  bell: Bell,
  calendar: Calendar,
  'edit-3': Edit3,
  heart: Heart,
  target: Target,
  zap: Zap,
} as const;

/**
 * Icon colors based on action type
 */
const ACTION_COLORS: Record<
  QuickAction['actionType'],
  { icon: string; bg: string }
> = {
  // orange
  celebrate: { bg: '#fef9c3', icon: '#ca8a04' },

  // violet
  editHabit: { bg: '#cffafe', icon: '#0891b2' },

  // red
  makeSmaller: { bg: '#ffedd5', icon: '#ea580c' },

  // emerald
  reviewWhy: { bg: '#fee2e2', icon: '#dc2626' },

  setReminder: { bg: '#ede9fe', icon: '#7c3aed' },

  // cyan
  viewHistory: { bg: '#d1fae5', icon: '#059669' }, // yellow
};

/**
 * QuickActionItem Component
 *
 * Individual quick action button with icon, label, and subtitle.
 */
const QuickActionItem = React.memo(function QuickActionItem({
  action,
  onPress,
  index,
  reduceMotion,
}: {
  action: QuickAction;
  onPress: (action: QuickAction) => void;
  index: number;
  reduceMotion: boolean;
}) {
  const { triggerLightImpact } = useHapticFeedback();
  const Icon = ICON_MAP[action.icon];
  const colors = ACTION_COLORS[action.actionType];

  const handlePress = () => {
    triggerLightImpact();
    onPress(action);
  };

  const animationDelay = reduceMotion ? 0 : 50 + index * 50;

  return (
    <Animated.View
      entering={
        reduceMotion ? undefined : FadeIn.delay(animationDelay).duration(200)
      }
    >
      <Pressable
        accessibilityHint={action.subtitle}
        accessibilityLabel={action.label}
        accessibilityRole='button'
        style={({ pressed }) => [
          styles.actionItem,
          pressed && styles.actionItemPressed,
        ]}
        testID={`quick-action-${action.id}`}
        onPress={handlePress}
      >
        {/* Icon Container */}
        <View
          accessibilityElementsHidden
          importantForAccessibility='no-hide-descendants'
          style={[styles.iconContainer, { backgroundColor: colors.bg }]}
        >
          <Icon color={colors.icon} size={20} strokeWidth={2} />
        </View>

        {/* Text Content */}
        <View style={styles.actionTextContainer}>
          <Text style={styles.actionLabel}>{action.label}</Text>
          {action.subtitle && (
            <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
});

/**
 * TipQuickActionsSheet Component
 *
 * Bottom sheet modal with contextual quick actions for habit tips.
 */
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

  // Get quick actions based on tip type
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Quick Actions</Text>
            <Text numberOfLines={2} style={styles.headerSubtitle}>
              {tipText}
            </Text>
          </View>

          {/* Close Button */}
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

        {/* Divider */}
        <View style={styles.divider} />

        {/* Quick Actions List */}
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

        {/* Bottom Padding for Safe Area */}
        <View style={styles.bottomPadding} />
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  actionItem: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  actionItemPressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  actionLabel: {
    color: '#1c1917', // stone-900
    fontSize: 15,
    fontWeight: '600',
  },
  actionsList: {
    gap: 4,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  actionSubtitle: {
    color: '#78716c', // stone-500
    fontSize: 13,
    marginTop: 2,
  },
  actionTextContainer: {
    flex: 1,
  },
  bottomPadding: {
    height: 8,
  },
  closeButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  container: {
    paddingBottom: 8,
  },
  divider: {
    backgroundColor: '#e7e5e4', // stone-200
    height: 1,
    marginHorizontal: 16,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  headerSubtitle: {
    color: '#78716c', // stone-500
    fontSize: 14,
    marginTop: 4,
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  headerTitle: {
    color: '#1c1917', // stone-900
    fontSize: 18,
    fontWeight: '700',
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});

export default TipQuickActionsSheet;
