/**
 * CustomizeSection Component
 *
 * Visual customization options for a habit split into cards:
 * - Appearance card: Emoji icon and accent color
 * - Reminders card: Toggle and time selection
 */

import { View } from 'react-native';
import { EmojiPicker } from '../../components/CreateHabitModal/components/EmojiPicker';
import { ColorPickerSection } from '../../components/CreateHabitModal/components/ColorPickerSection';
import { EnhancedReminderSelector } from '../../components/CreateHabitModal/components/EnhancedReminderSelector';
import { HABIT_COLORS } from '../../components/CreateHabitModal/constants';
import { Card } from './Card';

interface CustomizeSectionProps {
  habitName: string;
  selectedEmoji: string | null;
  selectedColor: string;
  remindersEnabled: boolean;
  reminderTime: Date;
  onEmojiSelect: (emoji: string | null) => void;
  onColorSelect: (color: string) => void;
  onReminderToggle: (enabled: boolean) => void;
  onReminderTimeChange: (time: Date) => void;
}

export function CustomizeSection({
  habitName,
  selectedEmoji,
  selectedColor,
  remindersEnabled,
  reminderTime,
  onEmojiSelect,
  onColorSelect,
  onReminderToggle,
  onReminderTimeChange,
}: CustomizeSectionProps) {
  return (
    <View>
      {/* Appearance Card */}
      <Card delay={150} icon='✨' title='Appearance'>
        <EmojiPicker
          hideLabel
          habitName={habitName}
          selectedEmoji={selectedEmoji}
          onSelect={onEmojiSelect}
        />

        <View className='mt-4'>
          <ColorPickerSection
            hideLabel
            colors={HABIT_COLORS}
            selectedColor={selectedColor}
            onSelectColor={onColorSelect}
          />
        </View>
      </Card>

      {/* Reminders Card */}
      <Card delay={200} icon='🔔' title='Reminders'>
        <EnhancedReminderSelector
          enabled={remindersEnabled}
          reminderTime={reminderTime}
          onTimeChange={onReminderTimeChange}
          onToggle={onReminderToggle}
        />
      </Card>
    </View>
  );
}
