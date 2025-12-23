import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { Motion } from '../../../constants/motion';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

interface SmartSuggestionsProps {
  onPick: (emoji: string | null, name: string, color?: string) => void;
  query: string;
}

interface Suggestion {
  color: string;
  emoji: string;
  keywords: string[];
  name: string;
}

const SUGGESTIONS: Suggestion[] = [
  // Health & Fitness
  { color: '#60a5fa', emoji: '💧', keywords: ['water', 'drink', 'hydrate'], name: 'Drink water' },
  { color: '#10b981', emoji: '🚶', keywords: ['walk', 'steps', 'outside'], name: 'Walk 15 minutes' },
  { color: '#22c55e', emoji: '🏃', keywords: ['run', 'jog', 'cardio'], name: 'Run 20 minutes' },
  { color: '#14b8a6', emoji: '💪', keywords: ['workout', 'gym', 'exercise', 'lift'], name: 'Workout 30 minutes' },
  { color: '#a78bfa', emoji: '🧘', keywords: ['meditate', 'mindful', 'calm', 'breathe'], name: 'Meditate 5 minutes' },
  { color: '#06b6d4', emoji: '🚴', keywords: ['bike', 'cycle', 'cycling'], name: 'Bike ride' },
  { color: '#8b5cf6', emoji: '🤸', keywords: ['stretch', 'yoga', 'flexible'], name: 'Stretch 10 minutes' },
  { color: '#6366f1', emoji: '😴', keywords: ['sleep', 'rest', 'bed'], name: 'Sleep 8 hours' },
  { color: '#f59e0b', emoji: '🌅', keywords: ['wake', 'morning', 'early'], name: 'Wake up early' },

  // Nutrition
  { color: '#ef4444', emoji: '🍎', keywords: ['healthy', 'snack', 'fruit'], name: 'Eat a healthy snack' },
  { color: '#84cc16', emoji: '🥗', keywords: ['vegetable', 'salad', 'greens'], name: 'Eat vegetables' },
  { color: '#fb923c', emoji: '🍊', keywords: ['vitamin', 'supplement'], name: 'Take vitamins' },
  { color: '#78716c', emoji: '☕', keywords: ['coffee', 'caffeine'], name: 'No coffee after 2pm' },
  { color: '#78716c', emoji: '🥤', keywords: ['soda', 'sugar', 'drink'], name: 'No soda today' },

  // Mental & Learning
  { color: '#f59e0b', emoji: '📖', keywords: ['read', 'book', 'reading'], name: 'Read 10 minutes' },
  { color: '#f97316', emoji: '📝', keywords: ['journal', 'write', 'diary'], name: 'Journal 3 lines' },
  { color: '#ec4899', emoji: '🙏', keywords: ['gratitude', 'grateful', 'thankful'], name: 'Practice gratitude' },
  { color: '#3b82f6', emoji: '🧠', keywords: ['learn', 'study', 'knowledge'], name: 'Learn something new' },
  { color: '#eab308', emoji: '📚', keywords: ['study', 'school', 'course'], name: 'Study 30 minutes' },
  { color: '#a855f7', emoji: '✍️', keywords: ['write', 'writing', 'words'], name: 'Write 100 words' },

  // Productivity & Focus
  { color: '#78716c', emoji: '📱', keywords: ['phone', 'screen', 'digital', 'detox'], name: 'No phone for 1 hour' },
  { color: '#dc2626', emoji: '🎯', keywords: ['goal', 'task', 'complete'], name: 'Complete daily goal' },
  { color: '#0891b2', emoji: '📅', keywords: ['plan', 'tomorrow', 'schedule'], name: 'Plan tomorrow' },
  { color: '#06b6d4', emoji: '🧹', keywords: ['clean', 'tidy', 'organize'], name: 'Clean for 10 minutes' },
  { color: '#10b981', emoji: '✅', keywords: ['bed', 'make', 'morning'], name: 'Make my bed' },
  { color: '#7c3aed', emoji: '⏰', keywords: ['time', 'block', 'focus'], name: 'Time block work' },

  // Social & Creative
  { color: '#f472b6', emoji: '👨‍👩‍👧‍👦', keywords: ['family', 'call', 'parents'], name: 'Call family' },
  { color: '#fb7185', emoji: '💌', keywords: ['friend', 'text', 'message'], name: 'Text a friend' },
  { color: '#ec4899', emoji: '🎨', keywords: ['creative', 'art', 'draw'], name: 'Creative time' },
  { color: '#a855f7', emoji: '🎸', keywords: ['instrument', 'music', 'practice', 'guitar', 'piano'], name: 'Practice instrument' },
  { color: '#6366f1', emoji: '📷', keywords: ['photo', 'picture', 'camera'], name: 'Take a photo' },
  { color: '#22c55e', emoji: '🌱', keywords: ['plant', 'garden', 'water'], name: 'Tend to plants' },
];

interface SuggestionChipProps {
  color: string;
  emoji: string;
  isHighlighted: boolean;
  name: string;
  onPick: (emoji: string, name: string, color: string) => void;
}

const SuggestionChip = ({ color, emoji, isHighlighted, name, onPick }: SuggestionChipProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const { triggerSelection } = useHapticFeedback();

  const handlePressIn = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.fast,
      easing: Motion.easing.inEase,
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.base,
      easing: Motion.easing.outEase,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePress = useCallback(() => {
    triggerSelection();
    onPick(emoji, name, color);
  }, [color, emoji, name, onPick, triggerSelection]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityLabel={`Use habit: ${name}`}
        accessibilityRole="button"
        className={`flex-row items-center rounded-2xl px-4 py-3 ${
          isHighlighted ? 'bg-blue-50' : 'bg-white'
        }`}
        style={{
          borderColor: isHighlighted ? '#3b82f6' : '#e7e5e4',
          borderWidth: isHighlighted ? 2 : 1,
          shadowColor: '#000',
          shadowOffset: { height: 1, width: 0 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
        }}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View
          className="mr-3 h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: color + '20' }}
        >
          <Text className="text-xl">{emoji}</Text>
        </View>
        <Text className="text-sm font-semibold text-stone-700">{name}</Text>
      </Pressable>
    </Animated.View>
  );
};

export const SmartSuggestions = ({ onPick, query }: SmartSuggestionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const filteredSuggestions = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (q.length < 2) {
      // Show popular habits when no query
      return SUGGESTIONS.slice(0, 6);
    }

    // Filter by name or keywords match
    const matches = SUGGESTIONS.filter(
      ({ keywords, name }) =>
        name.toLowerCase().includes(q) ||
        keywords.some((kw) => kw.includes(q) || q.includes(kw))
    );

    return matches.slice(0, 6);
  }, [query]);

  // Animate when query changes
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
    if (q.length < 2) {
      return '💡 Popular habits';
    }
    if (filteredSuggestions.length === 0) {
      return '💡 No matches — keep typing!';
    }
    return `💡 Suggestions for "${q}"`;
  }, [query, filteredSuggestions.length]);

  const handlePick = useCallback(
    (emoji: string, name: string, color: string) => {
      onPick(emoji, name, color);
    },
    [onPick]
  );

  if (filteredSuggestions.length === 0 && query.trim().length >= 2) {
    return (
      <View className="mb-6">
        <Text className="mb-3 text-sm font-semibold text-stone-500">{label}</Text>
        <View className="items-center rounded-2xl bg-stone-50 py-6">
          <Text className="text-3xl">🎯</Text>
          <Text className="mt-2 text-sm text-stone-500">Create your own unique habit!</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-6">
      <Text className="mb-3 text-sm font-semibold text-stone-500">{label}</Text>

      <Animated.View style={{ opacity: fadeAnim }}>
        <ScrollView
          contentContainerStyle={{ gap: 10 }}
          horizontal
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
