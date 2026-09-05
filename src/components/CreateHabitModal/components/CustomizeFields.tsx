/**
 * CustomizeFields - icon and colour controls shared by Add and Edit.
 * Rendered inside the shared habit form body, below the name input.
 * Icon/colour follow spec 2a: left caps labels, 5-col icon grid, one colour row.
 * The reminder now lives in the "More to customize" panel (AdvancedOptions).
 */

import { View } from 'react-native';
import { SectionLabel } from '@/components/AdvancedOptions/panel/SectionLabel';
import { EmojiPicker } from './EmojiPicker';
import { EmojiBrowseSheet } from './EmojiPicker/EmojiBrowseSheet';
import { useEmojiBrowseSheet } from './EmojiPicker/useEmojiBrowseSheet';
import { ColorPickerSection } from './ColorPickerSection';

const SECTION_GAP = { marginTop: 24 };

interface CustomizeFieldsProps {
  emojiQueryName: string;
  isEmojiLocked: boolean;
  selectedEmoji: string | null;
  onEmojiSelect: (emoji: string | null) => void;
  colors: readonly string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
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
