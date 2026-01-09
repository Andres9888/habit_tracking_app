import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { getAISuggestions } from './suggestions';
import { SuggestionButton } from './SuggestionButton';

interface AISuggestionChipsProps {
  input: string;
  onAppend: (suggestion: string) => void;
  visible: boolean;
}

export const AISuggestionChips = ({
  input,
  onAppend,
  visible,
}: AISuggestionChipsProps) => {
  const suggestions = useMemo(() => getAISuggestions(input), [input]);

  if (!visible || suggestions.length === 0) return null;

  return (
    <View className='mb-3'>
      <Text className='mb-2 text-xs font-medium text-violet-500'>
        ✨ SUGGESTIONS
      </Text>
      <View className='flex-row flex-wrap'>
        {suggestions.map((suggestion) => (
          <SuggestionButton
            key={suggestion}
            suggestion={suggestion}
            onPress={() => onAppend(suggestion)}
          />
        ))}
      </View>
    </View>
  );
};
