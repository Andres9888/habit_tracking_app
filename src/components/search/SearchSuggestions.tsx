import { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface SearchSuggestionsProps {
  suggestions: string[];
  query: string;
  onSelect: (suggestion: string) => void;
}

export const SearchSuggestions = memo(function SearchSuggestions({
  suggestions,
  query,
  onSelect,
}: SearchSuggestionsProps) {
  if (suggestions.length === 0 || query.length < 2) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(100)}
      style={styles.container}
      accessibilityRole="menu"
    >
      {suggestions.map((suggestion, index) => (
        <Pressable
          key={suggestion}
          style={({ pressed }) => [
            styles.suggestion,
            pressed && styles.suggestionPressed,
            index === 0 && styles.suggestionFirst,
            index === suggestions.length - 1 && styles.suggestionLast,
          ]}
          accessibilityLabel={suggestion}
          accessibilityRole="menuitem"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onSelect(suggestion);
          }}
        >
          <Search color="#A8A29E" size={14} />
          <Text style={styles.suggestionText} numberOfLines={1}>
            {highlightQuery(suggestion, query)}
          </Text>
        </Pressable>
      ))}
    </Animated.View>
  );
});

// Helper to highlight matching query portion
function highlightQuery(text: string, query: string): React.ReactNode {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <Text style={{ fontWeight: '700', color: '#1C1917' }}>
        {text.slice(index, index + query.length)}
      </Text>
      {text.slice(index + query.length)}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F5F5F4',
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F4',
  },
  suggestionPressed: {
    backgroundColor: '#FAFAF9',
  },
  suggestionFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  suggestionLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomWidth: 0,
  },
  suggestionText: {
    fontSize: 14,
    color: '#57534E',
    flex: 1,
  },
});
