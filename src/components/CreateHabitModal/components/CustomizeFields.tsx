/**
 * CustomizeFields - icon, color and reminder controls shared by Add and Edit.
 * Rendered inside the shared habit form body, below the name input.
 * Icon/colour follow spec 2a: left caps labels, 5-col icon grid, one colour row.
 * (The reminder still lives here; a later phase folds it into the panel.)
 */

import type { RefObject } from 'react';
import { View } from 'react-native';
import type { View as ViewType } from 'react-native';
import { SectionLabel } from '@/components/AdvancedOptions/panel/SectionLabel';
import { EmojiPicker } from './EmojiPicker';
import { EmojiBrowseSheet } from './EmojiPicker/EmojiBrowseSheet';
import { useEmojiBrowseSheet } from './EmojiPicker/useEmojiBrowseSheet';
import { ColorPickerSection } from './ColorPickerSection';
import { EnhancedReminderSelector } from './EnhancedReminderSelector';

const SECTION_GAP = { marginTop: 24 };

interface CustomizeFieldsProps {
  emojiQueryName: string;
  isEmojiLocked: boolean;
  selectedEmoji: string | null;
  onEmojiSelect: (emoji: string | null) => void;
  colors: readonly string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
  reminderEnabled: boolean;
  reminderTime: Date;
  onReminderToggle: (enabled: boolean) => void;
  onReminderTimeChange: (time: Date) => void;
  /** Create-flow only — see EnhancedReminderSelectorProps. */
  snapReminderDefaultToPreset?: boolean;
  reminderSectionRef?: RefObject<ViewType | null>;
}

// eslint-disable-next-line max-lines-per-function
export function CustomizeFields({
  emojiQueryName,
  isEmojiLocked,
  selectedEmoji,
  onEmojiSelect,
  colors,
  selectedColor,
  onColorSelect,
  reminderEnabled,
  reminderTime,
  onReminderToggle,
  onReminderTimeChange,
  snapReminderDefaultToPreset = false,
  reminderSectionRef,
}: CustomizeFieldsProps) {
  const browse = useEmojiBrowseSheet();

  return (
    <View className='px-6'>
      <SectionLabel
        action={{ label: 'BROWSE ALL', onPress: browse.openSheet }}
        label='ICON'
      />

      <EmojiPicker
        hideLabel
        habitName={emojiQueryName}
        isLocked={isEmojiLocked}
        layout='grid'
        selectedEmoji={selectedEmoji}
        onBrowse={browse.openSheet}
        onSelect={onEmojiSelect}
      />

      <View style={SECTION_GAP}>
        <SectionLabel label='COLOR' />
        <ColorPickerSection
          hideLabel
          colors={colors}
          selectedColor={selectedColor}
          variant='row'
          onSelectColor={onColorSelect}
        />
      </View>

      <View ref={reminderSectionRef} collapsable={false} style={SECTION_GAP}>
        <EnhancedReminderSelector
          enabled={reminderEnabled}
          reminderTime={reminderTime}
          snapDefaultToPresetOnEnable={snapReminderDefaultToPreset}
          onTimeChange={onReminderTimeChange}
          onToggle={onReminderToggle}
        />
      </View>

      <EmojiBrowseSheet
        habitName={emojiQueryName}
        selectedEmoji={selectedEmoji}
        visible={browse.visible}
        onClose={browse.closeSheet}
        onSelect={onEmojiSelect}
      />
    </View>
  );
}
