import { memo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { QuickAccessEmojiItem } from './QuickAccessEmojiItem';

interface RecentEmojisProps {
  recentEmojis: string[];
  selectedEmoji?: string | null;
  onEmojiSelect: (emoji: string) => void;
}

export const RecentEmojis = memo(
  ({ recentEmojis, selectedEmoji, onEmojiSelect }: RecentEmojisProps) => {
    const { colors } = useThemeColors();

    return (
    <View className='px-4 pb-2'>
      <Text className='mb-2 text-xs font-semibold uppercase tracking-wider' style={{ color: colors.text.secondary }}>
        Recently Used
      </Text>
      <ScrollView
        horizontal
        contentContainerStyle={{ gap: 8 }}
        showsHorizontalScrollIndicator={false}
      >
        {recentEmojis.map((emoji) => (
          <QuickAccessEmojiItem
            key={emoji}
            accessibilityLabelSuffix='from recently used'
            emoji={emoji}
            isSelected={selectedEmoji === emoji}
            onPress={() => onEmojiSelect(emoji)}
          />
        ))}
      </ScrollView>
    </View>
    );
  }
);

RecentEmojis.displayName = 'RecentEmojis';
