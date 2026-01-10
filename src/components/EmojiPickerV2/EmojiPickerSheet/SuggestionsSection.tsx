/**
 * SuggestionsSection Component
 * Displays AI-suggested emojis for the habit name
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { SuggestionEmojiCell } from './SuggestionEmojiCell';

interface SuggestionsSectionProps {
  habitName: string;
  suggestedEmojis: string[];
  selectedEmoji: string | null;
  onEmojiSelect: (emoji: string) => void;
}

export function SuggestionsSection({
  habitName,
  suggestedEmojis,
  selectedEmoji,
  onEmojiSelect,
}: SuggestionsSectionProps) {
  if (suggestedEmojis.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Sparkles color='#f59e0b' size={16} />
        <Text style={styles.headerText}>Perfect for "{habitName}"</Text>
      </View>
      <View style={styles.grid}>
        {suggestedEmojis.map((emoji) => (
          <SuggestionEmojiCell
            key={`suggested-${emoji}`}
            emoji={emoji}
            isSelected={selectedEmoji === emoji}
            onPress={() => onEmojiSelect(emoji)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fef3c7',
    borderColor: '#fcd34d',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    marginHorizontal: 20,
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    gap: 8,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 12,
  },
  headerText: {
    color: '#b45309',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});
