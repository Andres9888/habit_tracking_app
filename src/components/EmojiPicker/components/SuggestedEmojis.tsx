import { memo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { QuickAccessEmojiItem } from './QuickAccessEmojiItem';

interface SuggestedEmojisProps {
  habitName: string;
  suggestedEmojis: string[];
  selectedEmoji?: string | null;
  onEmojiSelect: (emoji: string) => void;
}

export const SuggestedEmojis = memo(
  ({
    habitName,
    suggestedEmojis,
    selectedEmoji,
    onEmojiSelect,
  }: SuggestedEmojisProps) => (
    <View className='px-4 pb-2'>
      <Text className='mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500'>
        Suggested for "{habitName}"
      </Text>
      <ScrollView
        horizontal
        contentContainerStyle={{ gap: 8 }}
        showsHorizontalScrollIndicator={false}
      >
        {suggestedEmojis.map((emoji) => (
          <QuickAccessEmojiItem
            key={`suggested-${emoji}`}
            accessibilityLabelSuffix='from suggestions'
            emoji={emoji}
            isSelected={selectedEmoji === emoji}
            onPress={() => onEmojiSelect(emoji)}
          />
        ))}
      </ScrollView>
    </View>
  )
);

SuggestedEmojis.displayName = 'SuggestedEmojis';
