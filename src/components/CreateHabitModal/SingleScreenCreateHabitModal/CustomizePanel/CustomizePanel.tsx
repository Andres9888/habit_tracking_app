/**
 * CustomizePanel - Expandable options panel
 *
 * Per spec:
 * - Content slides down, row rotates chevron: 240ms ease-out
 * - Collapse: 200ms ease-out
 * - Contains: Icon grid, Color swatches, Reminder, Phase toggle
 */

/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */

import { memo, useCallback, useState } from 'react';
import { Keyboard } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { EmojiPickerSheet } from '../../../EmojiPickerV2';
import { TimePickerModal } from '../../components/TimePickerModal';
import { ANIMATION, COLORS, SPACING } from '../constants';
import { ColorSection } from './ColorSection';
import { IconSection } from './IconSection';
import { PhaseSection, type DayPhase } from './PhaseSection';
import { ReminderSection } from './ReminderSection';

interface CustomizePanelProps {
  dayPhase: DayPhase;
  habitName: string;
  isVisible: boolean;
  onColorSelect: (color: string) => void;
  onEmojiSelect: (emoji: string | null) => void;
  onPhaseSelect: (phase: DayPhase) => void;
  onReminderTimeChange: (time: Date) => void;
  onReminderToggle: () => void;
  reminderEnabled: boolean;
  reminderTime: Date;
  selectedColor: string;
  selectedEmoji: string | null;
}

function CustomizePanelComponent({
  dayPhase,
  habitName,
  isVisible,
  onColorSelect,
  onEmojiSelect,
  onPhaseSelect,
  onReminderTimeChange,
  onReminderToggle,
  reminderEnabled,
  reminderTime,
  selectedColor,
  selectedEmoji,
}: CustomizePanelProps) {
  const { triggerSelection } = useHapticFeedback();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Animate expand/collapse
  const animatedStyle = useAnimatedStyle(() => ({
    maxHeight: withTiming(isVisible ? 400 : 0, {
      duration: isVisible
        ? ANIMATION.customizeExpand
        : ANIMATION.customizeCollapse,
      easing: Easing.out(Easing.ease),
    }),
    opacity: withTiming(isVisible ? 1 : 0, {
      duration: isVisible
        ? ANIMATION.customizeExpand
        : ANIMATION.customizeCollapse,
      easing: Easing.out(Easing.ease),
    }),
  }));

  const handleMoreEmojisPress = useCallback(() => {
    Keyboard.dismiss();
    triggerSelection();
    setShowEmojiPicker(true);
  }, [triggerSelection]);

  const handleReminderRowPress = useCallback(() => {
    if (reminderEnabled) {
      // If enabled, open time picker
      setShowTimePicker(true);
    } else {
      // If disabled, toggle on
      onReminderToggle();
    }
  }, [onReminderToggle, reminderEnabled]);

  const handleTimeConfirm = useCallback(
    (time: Date) => {
      onReminderTimeChange(time);
      setShowTimePicker(false);
    },
    [onReminderTimeChange]
  );

  const handleEmojiSheetSelect = useCallback(
    (emoji: string | null) => {
      onEmojiSelect(emoji);
      setShowEmojiPicker(false);
    },
    [onEmojiSelect]
  );

  // Don't render content when collapsed (optimization)
  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          backgroundColor: COLORS.neutralBase,
          borderRadius: 12,
          marginBottom: SPACING.md,
          marginHorizontal: SPACING.md,
          overflow: 'hidden',
          padding: SPACING.md,
        },
      ]}
    >
      <IconSection
        selectedEmoji={selectedEmoji}
        onMorePress={handleMoreEmojisPress}
        onSelect={onEmojiSelect}
      />

      <ColorSection selectedColor={selectedColor} onSelect={onColorSelect} />

      <ReminderSection
        enabled={reminderEnabled}
        reminderTime={reminderTime}
        onPress={handleReminderRowPress}
      />

      <PhaseSection selectedPhase={dayPhase} onSelect={onPhaseSelect} />

      {/* Full emoji picker sheet */}
      <EmojiPickerSheet
        habitName={habitName}
        selectedEmoji={selectedEmoji}
        visible={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onSelect={handleEmojiSheetSelect}
      />

      {/* Time picker modal */}
      <TimePickerModal
        initialTime={reminderTime}
        visible={showTimePicker}
        onCancel={() => setShowTimePicker(false)}
        onConfirm={handleTimeConfirm}
      />
    </Animated.View>
  );
}

export const CustomizePanel = memo(CustomizePanelComponent);
