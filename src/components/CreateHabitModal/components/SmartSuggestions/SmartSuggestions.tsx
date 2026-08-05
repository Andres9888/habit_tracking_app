import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, ScrollView, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { Motion } from '../../../../constants/motion';
import { EmptyState } from './EmptyState';
import { SuggestionChip } from './SuggestionChip';
import { SUGGESTIONS } from './suggestions.data';
import type { SmartSuggestionsProps } from './types';

export const SmartSuggestions = ({ onPick, query }: SmartSuggestionsProps) => {
  const { colors: themeColors } = useThemeColors();
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const filteredSuggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return SUGGESTIONS.slice(0, 6);
    const matches = SUGGESTIONS.filter(
      ({ keywords, name }) =>
        name.toLowerCase().includes(q) ||
        keywords.some((kw) => kw.includes(q) || q.includes(kw))
    );
    return matches.slice(0, 6);
  }, [query]);

  useEffect(() => {
    setIsLoading(true);
    Animated.timing(fadeAnim, {
      duration: Motion.duration.fast,
      toValue: 0.5,
      useNativeDriver: true,
    }).start(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
        Animated.timing(fadeAnim, {
          duration: Motion.duration.base,
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }, 150);
      return () => clearTimeout(timer);
    });
  }, [query, fadeAnim]);

  const label = useMemo(() => {
    const q = query.trim();
    if (q.length < 2) return '💡 Popular habits';
    if (filteredSuggestions.length === 0) return '💡 No matches — keep typing!';
    return `💡 Suggestions for "${q}"`;
  }, [query, filteredSuggestions.length]);

  const handlePick = useCallback(
    (emoji: string, name: string, color: string) => onPick(emoji, name, color),
    [onPick]
  );

  if (filteredSuggestions.length === 0 && query.trim().length >= 2) {
    return <EmptyState label={label} />;
  }

  return (
    <View className='mb-6'>
      <Text className='mb-3 text-sm font-semibold' style={{ color: themeColors.text.secondary }}>{label}</Text>
      <Animated.View style={{ opacity: fadeAnim }}>
        <ScrollView
          horizontal
          contentContainerStyle={{ gap: 10 }}
          showsHorizontalScrollIndicator={false}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <SuggestionChip
              key={`${suggestion.emoji}-${suggestion.name}`}
              color={suggestion.color}
              emoji={suggestion.emoji}
              isHighlighted={index === 0 && query.trim().length >= 2}
              name={suggestion.name}
              onPick={handlePick}
            />
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

export default SmartSuggestions;
