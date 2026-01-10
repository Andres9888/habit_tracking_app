import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SkeletonButton } from './SkeletonLoader';
import { SuggestionChip } from './SuggestionChip';
import { SUGGESTIONS } from './nameSuggestions.constants';

interface NameSuggestionsProps {
  query: string;
  onPick: (emoji: string | null, name: string, color?: string) => void;
}

export const NameSuggestions = ({ query, onPick }: NameSuggestionsProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return SUGGESTIONS.slice(0, 4);
    return SUGGESTIONS.filter(({ name }) =>
      name.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query]);

  // Simulate brief loading for polish
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (items.length === 0) return null;

  return (
    <View className='mb-6'>
      <Text className='mb-2 text-xs font-semibold uppercase tracking-wide text-[#78716c]'>
        💡 Tap to use
      </Text>
      {isLoading ? (
        <ScrollView
          horizontal
          contentContainerClassName='gap-2'
          showsHorizontalScrollIndicator={false}
        >
          {[1, 2, 3, 4].map((i) => (
            <SkeletonButton key={i} />
          ))}
        </ScrollView>
      ) : (
        <ScrollView
          horizontal
          contentContainerClassName='gap-2'
          showsHorizontalScrollIndicator={false}
        >
          {items.map(({ emoji, name, color }) => (
            <SuggestionChip
              key={`${emoji ?? 'none'}-${name}`}
              color={color}
              emoji={emoji}
              name={name}
              onPick={onPick}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default NameSuggestions;
