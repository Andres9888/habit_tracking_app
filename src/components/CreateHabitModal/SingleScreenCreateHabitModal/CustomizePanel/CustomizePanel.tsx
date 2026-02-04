/**
 * CustomizePanel Component
 * Expanded options panel for icon, color, and reminder selection
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
import { ReminderSection } from './ReminderSection';

interface CustomizePanelProps {
  habitName: string;
  isVisible: boolean;
  onColorSelect: (color: string) => void;
  onEmojiSelect: (emoji: string | null) => void;
  onReminderTimeChange: (time: Date) => void;
  onReminderToggle: () => void;
  reminderEnabled: boolean;
  reminderTime: Date;
  selectedColor: string;
  selectedEmoji: string | null;
}

function CustomizePanelComponent({
  habitName,
  isVisible,
  onColorSelect,
  onEmojiSelect,
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

  const animatedStyle = useAnimatedStyle(() => ({
    maxHeight: withTiming(isVisible ? 300 : 0, {
      duration: isVisible ? ANIMATION.customizeExpand : ANIMATION.customizeCollapse,
      easing: Easing.out(Easing.ease),
    }),
    opacity: withTiming(isVisible ? 1 : 0, {
      duration: isVisible ? ANIMATION.customizeExpand : ANIMATION.customizeCollapse,
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
      setShowTimePicker(true);
    } else {
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
      <IconSection selectedEmoji={selectedEmoji} onMorePress={handleMoreEmojisPress} onSelect={onEmojiSelect} />
      <ColorSection selectedColor={selectedColor} onSelect={onColorSelect} />
      <ReminderSection enabled={reminderEnabled} reminderTime={reminderTime} onPress={handleReminderRowPress} />

      <EmojiPickerSheet
        habitName={habitName}
        selectedEmoji={selectedEmoji}
        visible={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onSelect={handleEmojiSheetSelect}
      />

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
